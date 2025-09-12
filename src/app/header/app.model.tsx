"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getToken, getUser, removeToken } from "../lib/auth";
const Model = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
    const [user, setUser] = useState<any>(null);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const token = getToken();
        const storedUser = getUser();
        if (token && storedUser) {
            setIsLoggedIn(true);
            setUser(storedUser);
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    }, []);

    const handleLogout = () => {
        removeToken();
        setIsLoggedIn(false);
        setUser(null);
        setShowMenu(false);
        router.push("/login");
    };

    const handleClick = () => {
        if (isLoggedIn) {
            setShowMenu(!showMenu);
        } else {
            router.push("/login");
        }
    };


    return (
        <>
            <div className="flex m-4 mr-[15%] ml-auto">
                <Button
                    onClick={() => setIsModalOpen(true)}
                    type="default"
                    className="bg-gray-100 max-w-xs w-full h-12 px-4 rounded-3xl flex justify-start items-center border-gray-300"
                >
                    <div className="flex items-center justify-center mr-3">
                        <Image src="/icons/delivery.png" width={40} height={40} alt="" />
                    </div>
                    <div className="text-left overflow-hidden">
                        <p className="text-sm font-bold text-green-700 truncate whitespace-nowrap">
                            Đến Lấy
                        </p>
                        <p className="text-sm text-gray-800 truncate whitespace-nowrap">
                            AEON Phường Nam Định, tỉnh Ninh Bình
                        </p>
                    </div>
                </Button>

                {/* Icon user */}
                <div>
                    <Button
                        variant="solid"
                        className="bg-gray-100 ml-3 items-center justify-center w-12 h-12 rounded-full text-green-700"
                        onClick={handleClick}
                    >
                        <svg
                            className="w-[34px] h-[34px] text-green-700 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="2 0 20 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.2"
                                d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                        </svg>
                    </Button>

                    {/* Menu dropdown */}
                    {showMenu && isLoggedIn && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                            <ul>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { router.push("/profile") }}>
                                    Thông tin cá nhân
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    Cài đặt
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>


            <Modal
                closable={true}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={700}
            >
                <header className="flex items-center justify-between bg-white">
                    <button
                        onClick={() => setMode("delivery")}
                        className={`items-center justify-between w-[50%] ${mode === "delivery" ? "border-b-4 border-green-600" : ""
                            } p-2`}
                    >
                        <p className="hover:text-green-700 font-semibold text-gray-500">
                            Giao Hàng
                        </p>
                    </button>
                    <button
                        onClick={() => setMode("pickup")}
                        className={`items-center justify-between w-[50%] ${mode === "pickup" ? "border-b-4 border-green-600" : ""
                            } p-2`}
                    >
                        <p className="hover:text-green-700 font-semibold text-gray-500">
                            Đến Lấy
                        </p>
                    </button>
                </header>

                {mode === "delivery" && (
                    <div className="m-4 flex-1">
                        <input
                            className="max-w-2xl w-full h-10 px-4 border border-gray-300 rounded-3xl bg-gray-100 focus:border-green-500 focus:outline-none"
                            type="text"
                            placeholder="Vui lòng nhập địa chỉ..."
                        />
                        <div className="p-2">
                            <p className="text-green-700 text-xl font-semibold">
                                Vị trí hiện tại của bạn
                            </p>
                            <p className="text-gray-500 ">
                                AEON Phường Nam Định, tỉnh Ninh Bình
                            </p>
                        </div>
                    </div>
                )}

                {mode === "pickup" && (
                    <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-xl mx-auto mt-6">
                        <h3 className="text-lg font-bold mb-2 text-green-700">
                            Danh sách cửa hàng
                        </h3>
                        <p className="font-semibold">BDG-CH 44 Nguyen Dinh Chieu P.PC</p>
                        <p className="text-gray-700">
                            Địa chỉ: 44 Nguyễn Đình Chiểu, P. Phú Cường, TP. Thủ Dầu Một, T.
                            Bình Dương
                        </p>
                        <p className="text-gray-700">
                            Số điện thoại: (028) 7100 1968 (Ext.20028)
                        </p>
                        <p className="text-gray-700">Giờ hoạt động: 07:00 - 22:30</p>
                        <p className="text-green-600 font-semibold">
                            Trạng thái hoạt động: Mở cửa
                        </p>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default Model;
