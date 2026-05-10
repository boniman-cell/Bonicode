export default async function handler(req, res) {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(200).json({
                reply: "API key missing in Vercel environment variables"
            });
        }

        if (req.method !== "POST") {
            return res.status(200).json({
                reply: "Use POST method"
            });
        }

        const { message } = req.body || {};

        if (!message) {
            return res.status(200).json({
                reply: "No message sent"
            });
        }

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        {
                            role: "system",
                            content: `
You are Bonicode AI Studio Pro.

RULES:
- Return ONLY code or full apps
- No explanations
- No teaching
- No extra text
- If user sends code → fix and return full version
- If user requests app → build complete app
`
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const reply = data?.choices?.[0]?.message?.content;

        return res.status(200).json({
            reply: reply || "No AI response"
        });

    } catch (err) {
        return res.status(200).json({
            reply: "Server error: " + err.message
        });
    }
}
