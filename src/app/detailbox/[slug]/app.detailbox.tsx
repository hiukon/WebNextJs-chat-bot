'use client';
import { IBox } from 'app/types/backend';
import Image from 'next/image';
import { useState } from 'react';
interface Props {
    box: IBox;
}
const size = [
    { name: 'Xl', price: 10000 },
    { name: 'L', price: 5000 },
    { name: 'M', price: 0 },
];


const BoxDetail = ({ box }: Props) => {

    const [quantity, setQuantity] = useState(1);
    const [selectedSizeIndex, setSelectedSizeIndex] = useState(2);

    const selectedSizePrice = size[selectedSizeIndex].price;

    const basePrice = Number(box.price);

    const totalPrice = (basePrice + selectedSizePrice) * quantity;

    return (
        <div className="flex justify-center w-full p-6 mt-[50px]">
            <div className="bg-gray-100 p-4 rounded-xl w-[450px] h-[500px] flex items-center justify-center shadow-sm">
                <Image
                    src={box.image}
                    alt={box.name}
                    width={256}
                    height={256}
                    className="object-contain"
                />
            </div>
            <div className="ml-10 w-[500px]">
                <h2 className="text-2xl font-semibold text-green-700">{box.name}</h2>
                <div className='flex items-center justify-between '>
                    <p className="text-2xl text-green-700 font-bold mt-2">{basePrice.toLocaleString()} ₫</p>

                    <div className="flex items-center space-x-2">
                        <button
                            className="bg-green-700 text-2xl text-white px-2 rounded"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            −
                        </button>
                        <span>{quantity}</span>
                        <button
                            className="bg-green-700 text-2xl text-white px-2 rounded"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="font-semibold">Chọn kích cỡ</p>
                    <div className="flex items-center space-x-4 bg-white p-2 rounded-lg">
                        {size.map((s, idx) => (
                            <button
                                key={s.name}
                                onClick={() => setSelectedSizeIndex(idx)}
                                className={`w-[80px] h-[60px] border border-gray-300 rounded-lg overflow-hidden ${selectedSizeIndex === idx ? 'border-green-600 bg-green-700 text-white' : 'text-green-600'
                                    }`}
                            >
                                <div className="h-[60%] flex items-center justify-center font-semibold">{s.name}</div>
                                <div className="h-[40%] bg-gray-100 text-sm text-gray-500 font-semibold hover:text-green-700 flex items-center justify-center">
                                    +{s.price.toLocaleString()}₫
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center justify-between mt-6">

                    <button className="bg-green-700 text-white px-6 py-2 rounded-xl shadow-md">
                        🛒 Thêm vào giỏ hàng: {totalPrice.toLocaleString()} ₫
                    </button>
                </div>
            </div>
        </div>
    );
};


export default BoxDetail;
