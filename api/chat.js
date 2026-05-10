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
You are Bonicode AI Studio Pro, a senior full-stack developer and AI app builder.

Your job:
- Build full apps and websites (frontend + backend when needed)
- Write clean, production-ready code
- Create complete project structures
- Add features like authentication, dashboards, APIs, databases, etc.

Rules:
- Default output = FULL WORKING CODE
- Only explain if user asks
- Think like a Replit AI agent
- Always produce complete solutions, not fragments
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
