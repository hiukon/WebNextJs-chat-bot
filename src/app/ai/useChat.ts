// components/Chatbot/useChat.ts
"use client";
import { useEffect, useRef, useState } from "react";

export type Role = "user" | "model" | "bot";
export interface IMessage {
    id: string;
    role: Role;
    text: string;
    createdAt: string;
    image?: string;
}

const uid = () => Math.random().toString(36).slice(2, 9);

export function useChat(storageKey = "chat_history_v1") {
    const [messages, setMessages] = useState<IMessage[]>([
        {
            id: uid(),
            role: "model",
            text: "Xin chào\nGian hàng có thể giúp gì cho bạn ?",
            createdAt: new Date().toISOString(),
        },
    ]);
    const [thinking, setThinking] = useState(false);
    const chatHistoryRef = useRef<any[]>([]);
    const loadingRef = useRef(false);


    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) setMessages(JSON.parse(raw));
        } catch (e) { }
    }, [storageKey]);

    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(messages));
        } catch (e) { }
    }, [messages, storageKey]);

    const addUserMessage = async (text: string, imageBase64?: string, mime?: string) => {
        const m: IMessage = {
            id: uid(),
            role: "user",
            text,
            createdAt: new Date().toISOString(),
            image: imageBase64 ? `data:${mime};base64,${imageBase64}` : undefined,
        };


        setMessages((s) => [...s, m]);

        const parts: any[] = [{ text }];
        if (imageBase64 && mime) parts.push({ inline_data: { data: imageBase64, mime_type: mime } });
        chatHistoryRef.current.push({ role: "user", parts });

        setThinking(true);
        setMessages((s) => [...s, { id: uid(), role: "model", text: "...", createdAt: new Date().toISOString() }]);

        try {
            const res = await fetch("/api/gen", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: chatHistoryRef.current }),
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Network error");
            }
            const data = await res.json();
            const replyText = (data.reply ?? "Mình không hiểu, thử lại nhé.")
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .trim();

            setMessages((s) => {
                const copy = [...s];
                const idx = copy.map((x) => x.text).lastIndexOf("...");
                if (idx >= 0) copy[idx] = { ...copy[idx], text: replyText };
                else copy.push({ id: uid(), role: "model", text: replyText, createdAt: new Date().toISOString() });
                return copy;
            });

            chatHistoryRef.current.push({ role: "model", parts: [{ text: replyText }] });
        } catch (err: any) {
            setMessages((s) => s.map((m) => (m.text === "..." ? { ...m, text: `Lỗi: ${err.message}` } : m)));
        } finally {
            loadingRef.current = false;
            setThinking(false);
        }
    };


    return { messages, addUserMessage, thinking, setMessages };
}
