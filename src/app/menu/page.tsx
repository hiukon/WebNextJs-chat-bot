'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { IFood } from '../types/backend';
import Image from 'next/image';
import AntdMenu from './app.option';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Menu = () => {
    const { data, error, isLoading } = useSWR<IFood[]>('http://localhost:3000/api/foods', fetcher);
    const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ITEMS_PER_PAGE = 10;

    if (isLoading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div>Lỗi khi tải dữ liệu</div>;
    if (!data) return null;

    const filteredFoods = selectedCategory === 'Tất cả'
        ? data
        : data.filter(f => f.category === selectedCategory);

    const totalPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentFoods = filteredFoods.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <div className="flex w-full  ">
                <AntdMenu
                    foods={data}
                    onCategoryChange={(category) => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                    }}
                />
                <div className="w-[67%] max-w-screen-2xl mx-5 mt-4 text-center">

                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {currentFoods.map((f) => (
                            <div
                                key={f.name}
                                className="flex flex-col items-center mx-auto text-center h-[250px] w-full max-w-[200px] border duration-300 hover:shadow-2xl rounded-lg">
                                <Link
                                    href={`/detail/${f.slug}`}
                                    className="relative rounded-lg bg-gray-100 w-full h-[70%] flex items-center justify-center"
                                >
                                    <div className="w-[128px] h-[128px]">
                                        <Image
                                            src={f.image}
                                            alt={f.name}
                                            width={128}
                                            height={128}
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                </Link>
                                <button className="p-1 ml-5 text-green-700 text-left text-sm w-full">
                                    <p>{f.name}</p>
                                    <p className="font-semibold text-sm">{Number(f.price).toLocaleString()}đ</p>
                                </button>
                                <button className="mb-3 bg-green-700 font-semibold text-white w-[50%] h-[40px] border rounded-lg flex items-center justify-center">
                                    <p>Đặt mua</p>
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200"
                    disabled={currentPage === 1}>«</button>

                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-4 py-2 border rounded-lg ${currentPage === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-100'
                            }`}>
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200"
                    disabled={currentPage === totalPages}>»</button>
            </div>
        </>
    );
};

export default Menu;
