// In-memory store to track requests (persists per Cloudflare Edge node)
const ipCache = new Map();

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function onRequestPost(context) {
    const { request, env } = context;
    
    // --- 1. Basic Rate Limiting (Secondary Protection) ---
    const ip = request.headers.get("cf-connecting-ip") || "unknown-ip";
    const now = Date.now();
    const WINDOW_MS = 60 * 1000;
    const MAX_REQUESTS = 5;

    let rateData = ipCache.get(ip);
    if (!rateData) {
        rateData = { count: 0, startTime: now };
        ipCache.set(ip, rateData);
    }
    if (now - rateData.startTime > WINDOW_MS) {
        rateData.count = 0;
        rateData.startTime = now;
    }
    rateData.count++;

    if (rateData.count > MAX_REQUESTS) {
        return Response.json(
            { error: "Rate limit exceeded! Please wait a minute before asking another question." },
            { status: 429, headers: corsHeaders }
        );
    }
    if (ipCache.size > 1000) ipCache.clear();
    // --- End Rate Limiting ---

    try {
        const body = await request.json();
        const { questionText, subject, topic, imageBase64, mediaType, turnstileToken } = body;

        // --- 2. Cloudflare Turnstile Verification (Primary Protection) ---
        const turnstileSecret = env.TURNSTILE_SECRET_KEY || "0x4AAAAAAEj_Cj_L5JNKwh8uqrC4Bjd1mlk";
        if (turnstileSecret && turnstileToken) {
            const formData = new FormData();
            formData.append('secret', turnstileSecret);
            formData.append('response', turnstileToken);
            formData.append('remoteip', ip);

            const tsResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                body: formData,
                method: 'POST',
            });
            const tsOutcome = await tsResult.json();

            if (!tsOutcome.success) {
                return Response.json({ error: "Anti-bot verification failed. Please complete the verification checkbox again." }, { status: 403, headers: corsHeaders });
            }
        } else if (!turnstileToken) {
            return Response.json({ error: "Turnstile bot verification required. Please complete the verification checkbox." }, { status: 403, headers: corsHeaders });
        }
        // --- End Turnstile Verification ---

        // --- 3. Gemini Processing ---
        const apiKey = env.GEMINI_API_KEY || "REDACTED_API_KEY";
        if (!apiKey) {
            return Response.json({ error: "Gemini API Key not configured" }, { status: 500, headers: corsHeaders });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
        const systemMsg = "You are an expert JEE (IIT-JEE / JEE Advanced) tutor with deep knowledge of NCERT textbooks, H.C. Verma (Concepts of Physics), R.D. Sharma, S.L. Loney, Cengage, and 20 years of JEE past papers. When solving a question, follow this EXACT format:\n\n**THOUGHT PROCESS**\nThink aloud: identify what concept or formula applies, why, and any traps in the question.\n\n**CONCEPT**\nState the core principle, theorem, or formula (mention the NCERT chapter or book reference if relevant).\n\n**SOLUTION**\n1. Step one with working\n2. Step two with working\n3. Continue until final value\n\n**ANSWER**\nState the final answer clearly with units.\n\n**JEE TIP**\nOne key insight, common mistake to avoid, or a shortcut used in JEE exams.\n\nBe precise, use correct physics/chemistry/math notation, and keep each section concise.";
        
        const rawPrompt = `Subject: ${subject || "General"}\nTopic: ${topic || "General"}\n\nQuestion:\n${questionText || ""}`;
        let parts = [{ text: rawPrompt }];
        
        if (imageBase64 && mediaType) {
            parts.push({
                inlineData: { mimeType: mediaType, data: imageBase64 }
            });
        }

        const payload = {
            systemInstruction: { parts: [{ text: systemMsg }] },
            contents: [{ parts: parts }]
        };

        const geminiResponse = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!geminiResponse.ok) {
            const errBody = await geminiResponse.text();
            return Response.json({ error: `Gemini API error: ${geminiResponse.statusText} - ${errBody}` }, { status: geminiResponse.status, headers: corsHeaders });
        }

        const data = await geminiResponse.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) {
            return Response.json({ error: "Invalid response from Gemini API." }, { status: 500, headers: corsHeaders });
        }

        return Response.json({ text: content }, { headers: corsHeaders });

    } catch (e) {
        return Response.json({ error: e.message }, { status: 500, headers: corsHeaders });
    }
}
