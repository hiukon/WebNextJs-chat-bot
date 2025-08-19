'use client';
import { useState, useCallback } from 'react';

interface FileData {
    data: string | null;
    mime_type: string | null;
}

interface Message {
    text: string;
    type: 'user' | 'bot';
    file?: FileData;
}

interface ChatHistory {
    role: 'user' | 'model';
    parts: Array<{ text?: string; inline_data?: FileData }>;
}

const API_KEY = 'AIzaSyDszLu1I8vIGBgVQ9oY5z2alsEwQCEe2hE';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: 'Xin chào<br />Tôi có thể giúp gì cho bạn?', type: 'bot' },
    ]);
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const [userData, setUserData] = useState<{ message: string | null; file: FileData }>({
        message: null,
        file: { data: null, mime_type: null },
    });
    const [isThinking, setIsThinking] = useState(false);

    const sendMessage = useCallback(
        async (message: string) => {
            setUserData((prev) => ({ ...prev, message }));
            setMessages((prev) => [...prev, { text: message, type: 'user', file: userData.file.data ? userData.file : undefined }]);
            setChatHistory((prev) => [
                ...prev,
                {
                    role: 'user',
                    parts: [{ text: message }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])],
                },
            ]);

            setIsThinking(true);
            setTimeout(async () => {
                try {
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: chatHistory }),
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error.message);

                    const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1').trim();
                    setMessages((prev) => [...prev, { text: apiResponseText, type: 'bot' }]);
                    setChatHistory((prev) => [...prev, { role: 'model', parts: [{ text: apiResponseText }] }]);
                } catch (error) {
                    setMessages((prev) => [...prev, { text: (error as Error).message, type: 'bot' }]);
                } finally {
                    setUserData({ message: null, file: { data: null, mime_type: null } });
                    setIsThinking(false);
                }
            }, 600);
        },
        [chatHistory, userData.file]
    );

    const uploadFile = (file: FileData) => {
        setUserData((prev) => ({ ...prev, file }));
    };

    const cancelFile = () => {
        setUserData((prev) => ({ ...prev, file: { data: null, mime_type: null } }));
    };

    return { messages, isThinking, sendMessage, uploadFile, cancelFile };
};