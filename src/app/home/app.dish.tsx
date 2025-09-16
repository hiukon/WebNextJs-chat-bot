
'use client';
import { Button } from 'antd';
import { IFood } from '../types/backend';
import Image from 'next/image';
import React, { useState } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import ModelF from '../detail/[slug]/modelf';


interface IProps {
    food: IFood[];
}
const Dish = ({ food = [] }: IProps) => {
    const [visibleCount, setVisibleCount] = useState(5);
    const [visibleCount1, setVisibleCount1] = useState(5);
    const [isOpen, setIsOpen] = useState(false);

    const drinkFoods = food.filter((f) => f.category === "Đồ uống");
    const visibledrinkFoods = drinkFoods.slice(0, visibleCount);
    const cakeFoods = food.filter((u) => u.category === "Bánh");
    const visiblecakeFoods = cakeFoods.slice(0, visibleCount1);

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 5);
    };
    const handleShowMore1 = () => {
        setVisibleCount1((prev1) => prev1 + 5);
    };
    return (
        <>

            <div className="flex-1 mx-auto mt-4 text-center text-green-700 font-bold text-2xl">
                <p>Gian Hàng Đồ Uống </p>
            </div>
            <div className="w-[77%] max-w-screen-2xl gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center mx-auto mt-4 text-center">

                {visibledrinkFoods.map((f) => (

                    <div className="flex flex-col items-center mx-auto mt-4 text-center h-[340px] w-full max-w-[270px] border duration-300 hover:shadow-2xl rounded-lg">
                        < Link
                            href={`/detail/${f.slug}`} className="relative rounded-lg bg-gray-100 w-full h-[70%] flex items-center justify-center">
                            <div className="w-[128px] h-[128px]">
                                <Image
                                    src={f.image}
                                    alt=""
                                    width={128}
                                    height={128}
                                    className="object-contain w-full h-full"

                                />
                            </div>
                        </Link>
                        <Link href={`/detail/${f.slug}`} className="p-1 ml-5 text-green-700 text-left  w-full ">
                            <p>{f.name}</p>
                            <p className=' font-semibold'> {Number(f.price).toLocaleString()}đ</p>
                        </Link>
                        <ModelF food={f} isOpen={isOpen} onClose={() => setIsOpen(false)} />

                    </div>


                )
                )
                }

            </div>
            {visibleCount < drinkFoods.length && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleShowMore}
                        className="px-6 py-2 border-green-600 text-green-600 font-semibold rounded-lg border">
                        Hiển thị thêm
                    </button>
                </div>
            )}
            <div className="flex-1 mx-auto mt-4 text-center text-green-700 font-bold text-2xl">
                <p>Gian Hàng Bánh Ngọt </p>
            </div>
            <div className="w-[77%] max-w-screen-2xl gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center mx-auto mt-4 text-center">

                {visiblecakeFoods.map((u) => (

                    <div className="flex flex-col items-center mx-auto mt-4 text-center h-[340px] w-full max-w-[270px] border duration-300 hover:shadow-2xl rounded-lg">
                        <Link href={`/detail/${u.slug}`} className="relative rounded-lg bg-gray-100 w-full h-[70%] flex items-center justify-center">
                            <div className="w-[128px] h-[128px]">
                                <Image
                                    src={u.image}
                                    alt=""
                                    width={130}
                                    height={130}
                                    className="object-contain w-full h-full" />
                            </div>
                        </Link>
                        <Link href={`/detail/${u.slug}`} className="p-1 ml-5 text-green-700 text-left  w-full ">
                            <p>{u.name}</p>
                            <p className=' font-semibold'> {Number(u.price).toLocaleString()}đ</p>
                        </Link>
                        <ModelF food={u} isOpen={isOpen} onClose={() => setIsOpen(false)} />

                    </div>

                ))}

            </div>
            {visibleCount1 < cakeFoods.length && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleShowMore1}
                        className="px-6 py-2 border border-green-600 text-green-600 font-semibold rounded-lg "
                    >
                        Hiển thị thêm
                    </button>
                </div>
            )}
            <div className="flex-1 mx-auto mt-4 text-center text-green-700 font-bold text-2xl">
                <p>Tin tức & Khuyến mãi </p>
            </div>
            <div className="flex flex-col items-center mx-auto mt-4 h-[320px] w-[420px] border duration-300 hover:shadow-2xl rounded-lg">
                <Link className="relative rounded-lg bg-gray-100 w-full h-[70%] flex items-center justify-center" href={'https://phuclong.com.vn/khuyen-mai/me-dam-tra-100-trung-qua-20250623113634'}>
                    <Image
                        src={'/slides/slide1.jpg'}
                        alt=""
                        width={500}
                        height={500}
                        className=" w-full h-full" />
                </Link>
                <p className="w-full text-right mr-4 p-2 text-sm text-gray-500"> <EyeOutlined /> 4000</p>
                <Link className='w-full border-t border-black' href={'https://phuclong.com.vn/khuyen-mai/me-dam-tra-100-trung-qua-20250623113634'}>
                    <p className="w-full ml-4 p-2 text-xl text-gray-700"> Mê Dầm Trà ,100% Trúng Quà</p>
                </Link>
            </div>
        </>

    );
};

export default Dish;
