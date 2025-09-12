"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { setToken } from "../lib/auth";
import router from "next/router";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Đăng nhập thất bại");
            } else {
                // ✅ Dùng helper (lưu cả token + refreshToken)
                setToken(data.token, data.refreshToken);



                // Lưu thông tin user
                localStorage.setItem("user", JSON.stringify(data.user));

                setMessage("Đăng nhập thành công!");
                window.location.href = "/";
            }
        } catch (err) {
            setMessage("Lỗi server");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Image
                src="/bg/bg1.jpg"
                alt="Background"
                fill
                className="object-cover blur-sm"
                priority
            />
            <form
                onSubmit={handleLogin}
                className="backdrop-blur-sm bg-gray-20 p-6 rounded-lg shadow-lg h-[500px] w-[450px] flex flex-col items-center"
                style={{
                    backgroundImage: "url('/bg/thô.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "100% 100%",
                }}
            >
                <h1 className="text-3xl font-bold mb-5 text-center text-white">
                    Chào đại ka tới chơi ٩(ˊᗜˋ*)و ♡
                </h1>

                <p className="text-l ml-4 text-white text-left self-start">Nhập email</p>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-3/4 mb-2 p-2 border rounded-xl block"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <p className="text-l ml-4 text-white text-left self-start">Nhập mật khẩu</p>
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-3/4 mb-2 p-2 border rounded-xl block"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-1/3 bg-gray-100 text-black py-2 rounded hover:bg-gray-300"
                >
                    Đăng nhập
                </button>

                <p className="mt-3 text-sm text-center">
                    Chưa có tài khoản?{" "}
                    <Link href="/register" className="text-blue-600 hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>

                {message && <p className="mt-3 text-red-700 text-center">{message}</p>}
            </form>
        </div>
    );
}
