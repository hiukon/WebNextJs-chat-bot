'use client';

import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { useState } from 'react';
import { IFood, IBox } from '../types/backend';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const SearchPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';
    const { data: foods, error: foodError, isLoading: foodLoading } = useSWR<IFood[]>('http://localhost:3000/api/foods', fetcher);
    const { data: boxes, error: boxError, isLoading: boxLoading } = useSWR<IBox[]>('http://localhost:3000/api/boxes', fetcher);

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const isLoading = foodLoading || boxLoading;
    const error = foodError || boxError;

    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Lỗi khi tải dữ liệu</div>;
    if (!foods || !boxes) return null;

    const allItems = [...foods, ...boxes];

    const normalize = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    const normalizedQueryWords = normalize(query).split(/\s+/);

    const results = allItems.filter(item => {
        const nameWords = normalize(item.name).split(/\s+/);


        return normalizedQueryWords.every(qWord =>
            nameWords.includes(qWord) // 
        );
    });



    const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentItems = results.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-4">
                Kết quả tìm kiếm cho: <span className="text-green-700">{query}</span>
            </h2>

            {results.length === 0 && <p>Không tìm thấy sản phẩm phù hợp.</p>}

            <div className="w-[77%] max-w-screen-2xl gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center mx-auto mt-4 text-center">
                {currentItems.map((item) => (
                    <div key={item.name} className="flex flex-col items-center mx-auto mt-4 text-center h-[340px] w-full max-w-[270px] border duration-300 hover:shadow-2xl rounded-lg">
                        <button className="relative rounded-lg bg-gray-100 w-full h-[70%] flex items-center justify-center">
                            <div className="w-[128px] h-[128px]">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={130}
                                    height={130}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        </button>
                        <button className="p-1 ml-5 text-green-700 text-left  w-full ">
                            <p>{item.name}</p>
                            <p className='font-semibold'>{item.price}đ</p>
                        </button>
                        <button className="p-1 bg-green-700 font-semibold text-white w-[90%] h-[40px] border rounded-lg flex items-center justify-center">
                            <p>Đặt mua</p>
                        </button>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                        «
                    </button>
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 border rounded-lg ${currentPage === index + 1
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                        »
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
