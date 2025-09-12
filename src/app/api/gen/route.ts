// app/api/gen/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Food from "../../models/Food";
import Box from "../../models/Box";

const GOOGLE_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function POST(request: Request) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Server missing GOOGLE_API_KEY" },
                { status: 500 }
            );
        }

        // kết nối DB
        await connectDB();

        // lấy menu trong DB
        const foods = await Food.find().lean();
        const menuText = foods
            .map((f) => `${f.name} - ${f.price}`)
            .join("\n");

        const boxes = await Box.find().lean();
        const boxText = boxes
            .map((b) => `${b.name} - ${b.price}`)
            .join("\n");
        const body = await request.json();

        // thêm system prompt + menu vào nội dung
        const contents = [
            {
                role: "user",
                parts: [
                    {
                        text:
                            "Hãy đóng vai một trợ lý ảo hỗ khách hàng của cửa hàng TTH Shop bán đồ ăn và nước uống.\n" +
                            "Luôn trả lời ngắn gọn, lịch sự, chỉ nói về menu, món ăn, nước uống, khuyến mãi và đặt hàng.\n" +
                            "Đây là menu cửa hàng:\n" +
                            menuText + "\n" + boxText
                    },

                ],
            },
            ...body.contents,
        ];


        const resp = await fetch(`${GOOGLE_API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents }),
        });

        const json = await resp.json();
        if (!resp.ok) {
            console.error("Google API error:", json);
            return NextResponse.json(
                { error: json?.error?.message ?? "Google API error", details: json },
                { status: 500 }
            );
        }

        const candidate = json?.candidates?.[0];
        const reply =
            candidate?.content?.parts?.[0]?.text ??
            "Xin lỗi, hiện tại tôi chưa có thông tin món này.";

        return NextResponse.json({ reply });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message ?? "Unknown error" },
            { status: 500 }
        );
    }
}
