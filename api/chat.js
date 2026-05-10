export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Only POST allowed" });
        }

        const { message } = req.body || {};

        if (!message) {
            return res.status(400).json({ error: "No message received" });
        }

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "Missing API key in Vercel" });
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
                            content: "You are Bonicode AI, a helpful coding assistant."
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

        // SAFE RESPONSE HANDLING
        const reply = data?.choices?.[0]?.message?.content;

        if (!reply) {
            return res.status(500).json({
                error: "No reply from AI",
                raw: data
            });
        }

        return res.status(200).json({
            reply
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}
