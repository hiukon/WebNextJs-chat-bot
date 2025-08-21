// app/api/gen/route.ts
import { NextResponse } from "next/server";

const GOOGLE_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function POST(request: Request) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Server missing GOOGLE_API_KEY" }, { status: 500 });
        }

        const body = await request.json(); // expected: { contents: [...] }

        const resp = await fetch(`${GOOGLE_API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: body.contents,
            }),
        });

        const json = await resp.json();
        if (!resp.ok) {
            console.error("Google API error:", json);
            return NextResponse.json({ error: json?.error?.message ?? "Google API error", details: json }, { status: 500 });
        }

        const candidate = json?.candidates?.[0];
        const reply = candidate?.content?.parts?.[0]?.text ?? "";

        return NextResponse.json({ reply });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
    }
}
