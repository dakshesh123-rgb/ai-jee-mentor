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

// Resilient fallback chain of high-performing Gemini models
const CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3-flash-preview",
    "gemini-2.5-flash",
    "gemini-3.5-flash"
];

export async function onRequestPost(context) {
    const { request, env } = context;
    
    // --- 1. IP Rate Limiting ---
    const ip = request.headers.get("cf-connecting-ip") || "unknown-ip";
    const now = Date.now();
    const WINDOW_MS = 60 * 1000;
    const MAX_REQUESTS = 6;

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
            { error: "Rate limit reached. Please wait a minute before asking another question." },
            { status: 429, headers: corsHeaders }
        );
    }
    if (ipCache.size > 1000) ipCache.clear();
    // --- End Rate Limiting ---

    try {
        const body = await request.json();
        const { questionText, subject, topic, imageBase64, mediaType } = body;

        const apiKey = env.GEMINI_API_KEY || "REDACTED_API_KEY";
        if (!apiKey) {
            return Response.json({ error: "Gemini API Key not configured" }, { status: 500, headers: corsHeaders });
        }

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

        let solvedText = null;
        let lastError = null;

        // Try models sequentially with automatic failover if one model experiences 503 high demand
        for (const model of CANDIDATE_MODELS) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const geminiResponse = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (geminiResponse.ok) {
                    const data = await geminiResponse.json();
                    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (content) {
                        solvedText = content;
                        break;
                    }
                } else {
                    const errBody = await geminiResponse.text();
                    lastError = `Model ${model} returned ${geminiResponse.status}: ${errBody}`;
                    // Continue to next model in fallback chain
                }
            } catch (networkErr) {
                lastError = `Network error on ${model}: ${networkErr.message}`;
            }
        }

        if (!solvedText) {
            return Response.json(
                { error: `AI service temporarily busy across all models. Please try again shortly. (${lastError})` },
                { status: 503, headers: corsHeaders }
            );
        }

        return Response.json({ text: solvedText }, { headers: corsHeaders });

    } catch (e) {
        return Response.json({ error: e.message }, { status: 500, headers: corsHeaders });
    }
}
