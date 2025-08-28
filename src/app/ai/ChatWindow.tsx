
"use client";
import React, { useState } from "react";
import { useChat } from "./useChat";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import styles from "./chat.module.css";

export default function ChatWindow() {
    const { messages, addUserMessage, thinking } = useChat("my_chat_v1");
    const [open, setOpen] = useState(false);

    return (
        <div className={`${styles.wrapper} ${open ? styles.open : ""}`}>
            <button
                id="chatbot-toggler"
                className={styles.toggler}
                aria-label="Toggle chatbot"
                onClick={() => setOpen((v) => !v)}
            >
                <span className="material-symbols-rounded">support_agent</span>
                <span className="material-symbols-rounded">close</span>
            </button>

            <div className={styles["chatbot-popup"]}>
                <div className={styles["chat-header"]}>
                    <div className={styles["header-info"]}>
                        <svg className={styles["chatbot-logo"]} xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 650 700">
                            <path d="M352 64C352 46.3 337.7 32 320 32C302.3 32 288 46.3 288 64L288 128L192 128C139 128 96 171 96 224L96 448C96 501 139 544 192 544L448 544C501 544 544 501 544 448L544 224C544 171 501 128 448 128L352 128L352 64zM160 432C160 418.7 170.7 408 184 408L216 408C229.3 408 240 418.7 240 432C240 445.3 229.3 456 216 456L184 456C170.7 456 160 445.3 160 432zM280 432C280 418.7 290.7 408 304 408L336 408C349.3 408 360 418.7 360 432C360 445.3 349.3 456 336 456L304 456C290.7 456 280 445.3 280 432zM400 432C400 418.7 410.7 408 424 408L456 408C469.3 408 480 418.7 480 432C480 445.3 469.3 456 456 456L424 456C410.7 456 400 445.3 400 432zM224 240C250.5 240 272 261.5 272 288C272 314.5 250.5 336 224 336C197.5 336 176 314.5 176 288C176 261.5 197.5 240 224 240zM368 288C368 261.5 389.5 240 416 240C442.5 240 464 261.5 464 288C464 314.5 442.5 336 416 336C389.5 336 368 314.5 368 288zM64 288C64 270.3 49.7 256 32 256C14.3 256 0 270.3 0 288L0 384C0 401.7 14.3 416 32 416C49.7 416 64 401.7 64 384L64 288zM608 256C590.3 256 576 270.3 576 288L576 384C576 401.7 590.3 416 608 416C625.7 416 640 401.7 640 384L640 288C640 270.3 625.7 256 608 256z"></path>
                        </svg>
                        <div className={styles["logo-text"]} >
                            <h2 className="text-sm">Chatbot </h2>
                        </div>

                    </div>

                    <div>
                        <button id="close-chatbot" className="material-symbols-rounded text-blue-200" onClick={() => setOpen(false)}>
                            keyboard_arrow_down
                        </button>
                    </div>
                </div>

                <MessageList messages={messages} />
                <div className={styles["chat-footer"]}>
                    <ChatInput onSend={(text, base64, mime) => addUserMessage(text, base64, mime)} disabled={thinking} />
                </div>
            </div>
        </div>
    );
}
