export async function onRequestPost(context) {
    const { request, env } = context;
    const apiKey = env.GEMINI_API_KEY;

    if (!apiKey) {
        return Response.json({ error: "Gemini API Key not configured" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { questionText, subject, topic, imageBase64, mediaType } = body;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
        const systemMsg = "You are an expert JEE (IIT-JEE / JEE Advanced) tutor with deep knowledge of NCERT textbooks, H.C. Verma (Concepts of Physics), R.D. Sharma, S.L. Loney, Cengage, and 20 years of JEE past papers. When solving a question, follow this EXACT format:\n\n**THOUGHT PROCESS**\nThink aloud: identify what concept or formula applies, why, and any traps in the question.\n\n**CONCEPT**\nState the core principle, theorem, or formula (mention the NCERT chapter or book reference if relevant).\n\n**SOLUTION**\n1. Step one with working\n2. Step two with working\n3. Continue until final value\n\n**ANSWER**\nState the final answer clearly with units.\n\n**JEE TIP**\nOne key insight, common mistake to avoid, or a shortcut used in JEE exams.\n\nBe precise, use correct physics/chemistry/math notation, and keep each section concise.";
        
        const rawPrompt = `Subject: ${subject}\nTopic: ${topic}\n\nQuestion:\n${questionText}`;
        
        let parts = [{ text: rawPrompt }];
        
        if (imageBase64 && mediaType) {
            parts.push({
                inlineData: {
                    mimeType: mediaType,
                    data: imageBase64
                }
            });
        }

        const payload = {
            systemInstruction: {
                parts: [{ text: systemMsg }]
            },
            contents: [{
                parts: parts
            }]
        };

        const geminiResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!geminiResponse.ok) {
            const errBody = await geminiResponse.text();
            return Response.json({ error: `Gemini API error: ${geminiResponse.statusText} - ${errBody}` }, { status: geminiResponse.status });
        }

        const data = await geminiResponse.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) {
            return Response.json({ error: "Invalid response from Gemini API." }, { status: 500 });
        }

        return Response.json({ text: content });

    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}
