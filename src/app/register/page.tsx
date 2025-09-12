"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch("http://localhost:3000/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: username, email, password, address, phone }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Đăng ký thất bại");
            } else {
                setMessage("Đăng ký thành công! Chuyển sang đăng nhập...");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1500);
            }
        } catch (err) {
            setMessage("Lỗi server");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <Image
                src="/bg/test.jpg"
                alt="Background"
                fill
                className="object-cover blur-sm"
                priority
            />
            <form
                onSubmit={handleRegister}
                className="backdrop-blur-sm bg-gray-20 p-6 rounded-lg shadow-lg h-[600px] w-[450px] flex flex-col items-center" style={{ backgroundImage: "url('/bg/gau.png')", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "100% 100%", }}
            >
                <h2 className="text-2xl font-bold mb-4 text-center ">Đăng ký</h2>
                <p className="text-l ml-4 text-left self-start">Nhập tên người dùng: </p>
                <input
                    type="text"
                    placeholder="Tên người dùng"
                    className="w-[300px] mb-2 p-2 border rounded-xl"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <p className="text-l ml-4  text-left self-start">Nhập email: </p>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-[300px] mb-2 p-2 border rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <p className="text-l ml-4 text-left self-start">Nhập mật khẩu: </p>
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-[300px] mb-2 p-2 border rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <p className="text-l ml-4 text-left self-start">Nhập địa chỉ của bạn: </p>
                <input
                    type="text"
                    placeholder="Địa chỉ"
                    className="w-[300px] mb-2 p-2 border rounded-xl"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <p className="text-l ml-4 text-left self-start">Số điện thoại: </p>
                <input
                    type="text"
                    placeholder="Số điện thoại"
                    className="w-[300px] mb-3 p-2 border rounded-xl"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-1/3 bg-gray-100 py-2 rounded-md hover:bg-stone-300"
                >
                    Đăng ký
                </button>

                <p className="mt-3 text-sm text-center">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Đăng nhập ngay
                    </Link>
                </p>

                {message && <p className="mt-3 text-green-300 text-center">{message}</p>}
            </form>
        </div>
    );
}
