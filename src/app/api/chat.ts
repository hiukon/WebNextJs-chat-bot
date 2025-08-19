import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'AIzaSyDszLu1I8vIGBgVQ9oY5z2alsEwQCEe2hE';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export async function POST(request: NextRequest) {
    const { contents } = await request.json();
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);
        const reply = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1').trim();
        return NextResponse.json({ reply });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}