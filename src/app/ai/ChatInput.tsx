// components/Chatbot/ChatInput.tsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import styles from "./chat.module.css";

type Props = {
    onSend: (text: string, imageBase64?: string, mime?: string) => void;
    disabled?: boolean;
};

export default function ChatInput({ onSend, disabled }: Props) {
    const [value, setValue] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const textRef = useRef<HTMLTextAreaElement | null>(null);
    const [fileMeta, setFileMeta] = useState<{ base64?: string; mime?: string } | null>(null);
    const [expanded, setExpanded] = useState(false);
    const initialHeightRef = useRef<number>(0);

    useEffect(() => {
        if (textRef.current) {
            textRef.current.style.height = "auto";
            textRef.current.style.height = `${textRef.current.scrollHeight}px`;
            initialHeightRef.current = textRef.current.scrollHeight;
            setExpanded(textRef.current.scrollHeight > initialHeightRef.current);
        }
    }, []);

    const openFile = () => fileRef.current?.click();

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            const base64 = result.split(",")[1];
            setPreview(result);
            setFileMeta({ base64, mime: f.type });
        };
        reader.readAsDataURL(f);
        if (fileRef.current) fileRef.current.value = "";
    };

    const cancelFile = () => {
        setPreview(null);
        setFileMeta(null);
    };

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const text = value.trim();
        if (!text && !fileMeta) return;
        onSend(text || "", fileMeta?.base64, fileMeta?.mime);
        setValue("");
        cancelFile();
        if (textRef.current) {
            textRef.current.style.height = "auto";
            textRef.current.blur();
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        const ta = textRef.current!;
        ta.style.height = "auto";
        ta.style.height = `${ta.scrollHeight}px`;
        const base = initialHeightRef.current || ta.scrollHeight;
        setExpanded(ta.scrollHeight > base + 2);
    };

    return (
        <form className={`${styles["chat-form"]} ${expanded ? styles.expanded : ""}`} onSubmit={submit}>
            <textarea
                ref={textRef}
                className={styles["message-input"]}
                placeholder="message..."
                value={value}
                onChange={onInputChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && typeof window !== "undefined" && window.innerWidth > 768) {
                        e.preventDefault();
                        submit();
                    }
                }}
                rows={1}
                required={preview ? false : true}
            />
            <div className={styles["chat-controls"]}>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFileChange} />
                <div className={`${styles["file-upload-wrapper"]} ${preview ? styles.fileUploaded : ""}`}>
                    {preview ? (
                        <>
                            <img src={preview} alt="preview" className={styles.preview} />
                            <button type="button" onClick={cancelFile} className={`material-symbols-rounded ${styles["file-cancel"]}`}>close</button>
                        </>
                    ) : (
                        <button type="button" onClick={openFile} className={`material-symbols-rounded ${styles["file-upload"]}`}>attach_file</button>
                    )}
                </div>

                <button
                    type="button"
                    onClick={submit}
                    className={`${styles["send-message"]} ${disabled ? styles.sending : ""} material-symbols-rounded`}
                    disabled={disabled}
                    aria-label={disabled ? "Đang gửi" : "Gửi"}
                >
                    {disabled ? (
                        <span className={styles["button-dots"]} aria-hidden>
                            <span className={styles.dot}></span>
                            <span className={styles.dot}></span>
                            <span className={styles.dot}></span>
                        </span>
                    ) : (
                        "arrow_upward"
                    )}
                </button>
            </div>
        </form>

    );
}
