"use client";
import { useEffect, useState } from "react";
import { getToken, removeToken, getUser } from "../lib/auth";
import { useRouter } from "next/navigation";

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

    const logout = () => {
        removeToken();
        router.push("/login");
    };

    if (!user) return <p>Đang tải thông tin người dùng...</p>;

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-2">Xin chào, {user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}
