export async function onRequestPost(context) {
    const { request, env } = context;
    const apiKey = env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return Response.json({ error: "API Key not configured" }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { questionText, subject, topic, imageBase64, mediaType } = body;

        const url = "https://openrouter.ai/api/v1/chat/completions";
        const systemMsg = "You are an expert JEE (IIT-JEE / JEE Advanced) tutor with deep knowledge of NCERT textbooks, H.C. Verma (Concepts of Physics), R.D. Sharma, S.L. Loney, Cengage, and 20 years of JEE past papers. When solving a question, follow this EXACT format:\n\n**THOUGHT PROCESS**\nThink aloud: identify what concept or formula applies, why, and any traps in the question.\n\n**CONCEPT**\nState the core principle, theorem, or formula (mention the NCERT chapter or book reference if relevant).\n\n**SOLUTION**\n1. Step one with working\n2. Step two with working\n3. Continue until final value\n\n**ANSWER**\nState the final answer clearly with units.\n\n**JEE TIP**\nOne key insight, common mistake to avoid, or a shortcut used in JEE exams.\n\nBe precise, use correct physics/chemistry/math notation, and keep each section concise.";
        const rawPrompt = `Subject: ${subject}\nTopic: ${topic}\n${questionText}`;

        let payload = {};

        if (imageBase64 && mediaType) {
            const dataUrl = `data:${mediaType};base64,${imageBase64}`;
            payload = {
                model: "meta-llama/llama-4-maverick",
                messages: [
                    { role: "system", content: systemMsg },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: rawPrompt },
                            { type: "image_url", image_url: { url: dataUrl } }
                        ]
                    }
                ],
                max_tokens: 900
            };
        } else {
            payload = {
                model: "openai/gpt-oss-120b",
                messages: [
                    { role: "system", content: systemMsg },
                    { role: "user", content: rawPrompt }
                ],
                max_tokens: 900
            };
        }

        const openrouterResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "https://ai-jee-mentor.pages.dev"
            },
            body: JSON.stringify(payload)
        });

        if (!openrouterResponse.ok) {
            return Response.json({ error: `OpenRouter API error: ${openrouterResponse.statusText}` }, { status: openrouterResponse.status });
        }

        const data = await openrouterResponse.json();
        const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.message?.reasoning;

        if (!content) {
            return Response.json({ error: "Invalid response from OpenRouter API." }, { status: 500 });
        }

        return Response.json({ text: content });

    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}
