'use client';
import { useRef, useEffect, useState } from 'react';
import { useChat } from './useChat';
import styles from './chat.module.css';

const ChatInput = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLDivElement>(null); // Thêm ref cho chatForm
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [formBorderRadius, setFormBorderRadius] = useState('32px'); // Quản lý borderRadius bằng state
    const { sendMessage, uploadFile, cancelFile } = useChat();

    const initialInputHeight = textareaRef.current?.scrollHeight || 40;

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${initialInputHeight}px`;
            const handleInput = () => {
                textarea.style.height = `${initialInputHeight}px`;
                textarea.style.height = `${textarea.scrollHeight}px`;
                setFormBorderRadius(textarea.scrollHeight > initialInputHeight ? '15px' : '32px');
            };
            textarea.addEventListener('input', handleInput);
            return () => {
                textarea.removeEventListener('input', handleInput);
            };
        }
    }, [initialInputHeight]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const userMessage = e.currentTarget.value.trim();
        if (e.key === 'Enter' && userMessage && !e.shiftKey && window.innerWidth > 768) {
            e.preventDefault();
            sendMessage(userMessage);
        }
    };

    const handleFileChange = () => {
        const file = fileInputRef.current?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setFilePreview(result);
                const base64String = result.split(',')[1];
                uploadFile({ data: base64String, mime_type: file.type });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.chatFooter}>
            <div className={styles.chatForm} ref={formRef} style={{ borderRadius: formBorderRadius }}>
                <textarea
                    ref={textareaRef}
                    className={styles.messageInput}
                    placeholder="message..."
                    required
                    onKeyDown={handleKeyDown}
                ></textarea>
                <div className={styles.chatControls}>
                    <div className={`${styles.fileUploadWrapper} ${filePreview ? styles.fileUploaded : ''}`}>
                        <input
                            type="file"
                            accept="image/*"
                            id="file-input"
                            ref={fileInputRef}
                            hidden
                            onChange={handleFileChange}
                        />
                        {filePreview && <img src={filePreview} className={styles.filePreview} />}
                        <button
                            type="button"
                            className={`${styles.fileUpload} material-symbols-rounded`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            attach_file
                        </button>
                        {filePreview && (
                            <button
                                type="button"
                                className={`${styles.fileCancel} material-symbols-rounded`}
                                onClick={() => {
                                    setFilePreview(null);
                                    cancelFile();
                                }}
                            >
                                close
                            </button>
                        )}
                    </div>
                    <button
                        type="button"
                        className={`${styles.sendMessage} material-symbols-rounded`}
                        onClick={() => {
                            if (textareaRef.current?.value.trim()) {
                                sendMessage(textareaRef.current.value.trim());
                            }
                        }}
                    >
                        arrow_upward
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;