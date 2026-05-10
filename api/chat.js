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

ABSOLUTE RULES:
- ONLY output code
- NEVER explain anything
- NEVER describe HTML, JS, or logic
- NEVER add text before or after code
- ALWAYS return full working code

BEHAVIOR:
- If user sends code → fix and return full corrected version
- If user requests app → build full complete application
- Think like a Replit AI agent

OUTPUT FORMAT:
- RAW CODE ONLY
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
