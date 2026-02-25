"use client";
import { useEffect, useState } from "react";
import { getToken, removeToken, getUser } from "../lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAddress } from "./address";
interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<IUser | null>(null);
    const router = useRouter();
    const {
        provinces,
        districts,
        wards,
        setProvinceCode,
        setDistrictCode,
        setWardCode,
        addressText,
    } = useAddress();

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push("/login");
            return;
        }

        fetch("http://localhost:3000/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(() => {
                removeToken();
                router.push("/login");
            });
    }, [router]);


    const updateProfile = async () => {
        if (!user) return;
        const token = getToken();
        if (!token) return;

        const res = await fetch(`http://localhost:3000/api/users/${user._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: updatedAddress,
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
    const updatedAddress = user.address + ", " + addressText;

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
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-l text-green-700 mb-1">Họ & Tên</p>
                            <input
                                type="text"
                                className="w-full h-[45px] border border-green-700 rounded p-2"
                                value={user?.name || ""}
                                onChange={(e) => setUser({ ...user!, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <p className="text-l text-green-700 mb-1">Phone</p>
                            <input
                                type="text"
                                className="w-full h-[45px] border border-green-700 rounded p-2"
                                value={user?.phone || ""}
                                onChange={(e) => setUser({ ...user!, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <p className="text-l text-green-700 mb-1">Email</p>
                            <input
                                type="text"
                                className="w-full h-[45px] border border-green-700 rounded p-2"
                                value={user?.email || ""}
                                onChange={(e) => setUser({ ...user!, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <p className="text-l text-green-700 mb-1">Address</p>
                            <input
                                type="text"
                                className="w-full h-[45px] border border-green-700 rounded p-2"
                                value={user?.address || ""}
                                onChange={(e) => setUser({ ...user!, address: e.target.value })}

                            />
                        </div>
                        <div>
                            <p className="text-l text-green-700 mb-1">Nhập tỉnh/thành phố</p>
                            <select className="w-full h-[45px] border border-green-700 rounded p-2"
                                onChange={e => setProvinceCode(Number(e.target.value))}>
                                {provinces.map(p => (
                                    <option key={p.code} value={p.code}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p className="text-l text-green-700 mb-1">Nhập quận/huyện</p>
                            <select className="w-full h-[45px] border border-green-700 rounded p-2"
                                onChange={e => setDistrictCode(Number(e.target.value))}>
                                {districts.map(d => (
                                    <option key={d.code} value={d.code}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <p className="text-l text-green-700 mb-1">Nhập phường/xã</p>
                            <select className="w-full h-[45px] border border-green-700 rounded p-2"
                                onChange={e => setWardCode(Number(e.target.value))}>
                                {wards.map(w => (
                                    <option key={w.code} value={w.code}>{w.name}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                    <p><strong>Address: </strong>{updatedAddress}</p>
                    <button
                        onClick={updateProfile}
                        className="mt-4 bg-green-700 text-white px-4 py-2 rounded">
                        Lưu thông tin
                    </button>
                </div>

            </div>

        </div>
    );
}
