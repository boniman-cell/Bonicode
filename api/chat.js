export default async function handler(req, res) {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(200).json({
                reply: "API key missing in Vercel"
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
You are Bonicode AI Studio Pro MAX.

STRICT RULES:
- NEVER explain anything
- NEVER teach or describe code
- ONLY output final working code or full apps
- If user gives code → fix it silently and return full corrected version
- If user requests app → build complete full-stack app (frontend + backend if needed)
- Think like a Replit AI autonomous developer
- Output must always be production-ready code only
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
