import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const apiKey = process.env.HF_API_KEY;
        if (!apiKey || apiKey === 'your_huggingface_token_here') {
            return NextResponse.json({ error: 'HuggingFace API key not configured' }, { status: 500 });
        }

        const response = await fetch(
            'https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'meta-llama/Llama-3.1-8B-Instruct',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are Kody, a helpful and friendly AI banking assistant for Kodbank. Keep answers concise and relevant to banking, finance, and account queries. Be professional but warm.',
                        },
                        ...messages,
                    ],
                    max_tokens: 512,
                    temperature: 0.7,
                    stream: false,
                }),
            }
        );

        if (!response.ok) {
            const err = await response.text();
            console.error('HuggingFace API error:', err);
            return NextResponse.json({ error: 'AI service unavailable. Please try again.' }, { status: 502 });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response.';
        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Chat route error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
