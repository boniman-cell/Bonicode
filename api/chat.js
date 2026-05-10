export default async function handler(req, res) {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        // Check API key
        if (!apiKey) {
            return res.status(200).json({
                reply: "API key missing in Vercel environment variables"
            });
        }

        // Only POST allowed
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
You are Bonicode AI Studio Pro MAX — a senior full-stack AI software engineer.

STRICT RULES:
- ONLY return code or full applications
- NEVER explain anything
- NEVER add teaching or descriptions
- NEVER output extra text outside code

OUTPUT FORMAT RULE:
- Response must start with code immediately
- Response must end with code only
- No markdown explanations
- No comments about what you are doing

TASK BEHAVIOR:
- If user sends code → fix and return full corrected version
- If user requests app → build complete working app (frontend + backend if needed)
- If user asks anything → behave like a professional developer agent

You are NOT a teacher.
You are a production-level AI developer like a Replit AI agent.
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
