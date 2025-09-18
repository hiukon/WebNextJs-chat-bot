"use client";
import { useEffect, useState } from "react";
import { getToken, removeToken, getUser } from "../lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface IUser {
    userId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
}
export default function ProfilePage() {
    const [user, setUser] = useState<IUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        const localUser = getUser();
        if (localUser) {
            setUser(localUser);
            return;
        }
        const token = getToken();
        if (!token) {
            router.push("/login");
            return;
        }
        fetch("http://localhost:3000/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then((data) => setUser(data))
            .catch(() => {
                removeToken();
                router.push("/login");
            });
    }, [router]);

    const updateProfile = async () => {
        if (!user) return;
        const token = getToken();
        if (!token) return;

        const res = await fetch("http://localhost:3000/api/users/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            }),
        });

        if (res.ok) {
            alert("Cập nhật thành công!");
        } else {
            const errorText = await res.text();
            console.error("Lỗi cập nhật:", res.status, errorText);
            alert("Có lỗi xảy ra khi cập nhật!");
        }
    };

    if (!user) return <p>Đang tải thông tin người dùng...</p>;
    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row p-6 justify-center mt-4">
                <div className="w-full md:w-1/6 h-[450px] pr-4 space-y-6 border border-gray-300 rounded-lg p-4 m-3">
                    <ul>
                        <li className="flex px-4 py-2 border-b-2 hover:bg-gray-100 cursor-pointer" onClick={() => { router.push("/profile") }}>
                            <Image src="/profile/nguoi1.png"
                                alt="Người 1"
                                width={24}
                                height={24}
                                className="mr-2" /> Thông tin cá nhân
                        </li>
                        <li className="flex px-4 py-2 border-b-2 hover:bg-gray-100 cursor-pointer">
                            <Image src="/profile/help.png"
                                alt=""
                                width={24}
                                height={24}
                                className="mr-4" /> Hỗ trợ
                        </li>
                        {user.role === 'admin' && (
                            <li className="flex px-4 py-2 border-b-2 hover:bg-gray-100 cursor-pointer" onClick={() => { router.push("/profile") }}>
                                <Image src="/profile/help.png"
                                    alt=""
                                    width={24}
                                    height={24}
                                    className="mr-4" /> Trang admin
                            </li>)}
                    </ul>
                </div>


                <div className=" w-full md:w-1/2 h-[600px] pr-4 space-y-6 border border-gray-300 rounded-lg p-4 m-3">
                    <h2 className="text-2xl font-bold mb-2 text-green-700">Thông tin cá nhân</h2>
                    <div className="flex flex-col ">
                        <p className="text-l text-green-700">Họ & Tên</p>
                        <input type="text" className="w-1/3 h-[45px] border border-green-700 rounded p-2" placeholder="" value={user?.name || ""}
                            onChange={(e) => setUser({ ...user!, name: e.target.value })} />
                    </div>


                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <p><strong>Role:</strong> {user.role}</p></div>



            </div>
            <button
                onClick={updateProfile}
                className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
            >
                Lưu thông tin
            </button>
        </div>
    );
}
