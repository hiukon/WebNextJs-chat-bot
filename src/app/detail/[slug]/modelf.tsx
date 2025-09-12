import React from 'react';
import { Button, Modal } from 'antd';
import { IFood } from '@/app/types/backend';
import Image from 'next/image';
import SweetIceSelector from './app.sugar';

import { useCartStore } from '../../bill/cartStore';


const { useState } = React;;
interface ModelBillProps {
    food: IFood;
    isOpen: boolean;
    onClose: () => void;
}

const size = [
    { name: 'XL', price: 10000 },
    { name: 'L', price: 5000 },
    { name: 'M', price: 0 },
];

const toppings = [
    { name: 'Topping vải (4 trái)', price: 20000 },
    { name: 'Topping thạch konjac', price: 15000 },
    { name: 'Topping đặc thơm', price: 25000 },
    { name: 'Topping nhãn (4 trái)', price: 20000 },
    { name: 'Đào (3 miếng)', price: 20000 },
    { name: 'Topping đặc cam', price: 25000 },
];
const ModelF = ({ food, isOpen, onClose }: ModelBillProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [quantity, setQuantity] = useState(1);
    const [toppingCounts, setToppingCounts] = useState(Array(toppings.length).fill(0));
    const [selectedSizeIndex, setSelectedSizeIndex] = useState(2);


    const handleToppingChange = (index: number, delta: number) => {
        const updated = [...toppingCounts];
        updated[index] = Math.max(0, updated[index] + delta);
        setToppingCounts(updated);
    };

    const totalTopping = toppingCounts.reduce(
        (total, count, idx) => total + count * toppings[idx].price,
        0
    );
    const selectedSizePrice = size[selectedSizeIndex].price;
    const basePrice = Number(food.price);

    const totalPrice = (basePrice + selectedSizePrice) * quantity + totalTopping;
    const addItem = useCartStore((state) => state.addItem);
    return (
        <>
            <Button type="primary" onClick={showModal} className="p-1 bg-green-700 font-semibold text-white w-[90%] h-[40px] border rounded-lg flex items-center justify-center mb-3 ">
                Đặt mua
            </Button>
            <Modal
                closable={true}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={700}
            >
                <div className="flex justify-center w-full p-6 ">
                    <div className="bg-gray-100 p-4 rounded-xl w-[400px] h-[400px] flex items-center justify-center shadow-sm">
                        <Image
                            src={food.image}
                            alt={food.name}
                            width={128}
                            height={128}
                            className="object-contain"
                        />
                    </div>
                    <div className="ml-10 w-[500px]">
                        <h2 className="text-2xl font-semibold text-green-700">{food.name}</h2>
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


                        {food.category === 'Đồ uống' && (
                            <>
                                <SweetIceSelector />

                                <div className="mt-4">
                                    <p className="font-semibold mb-2">Chọn Topping</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {toppings.map((t, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm">{t.name}</p>
                                                    <p className="text-sm text-gray-500">{t.price.toLocaleString()} ₫</p>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <button
                                                        className="bg-gray-200 px-2 rounded"
                                                        onClick={() => handleToppingChange(index, -1)}
                                                    >
                                                        −
                                                    </button>
                                                    <span>{toppingCounts[index]}</span>
                                                    <button
                                                        className="bg-gray-200 px-2 rounded"
                                                        onClick={() => handleToppingChange(index, 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex items-center justify-between mt-6">

                            <button
                                onClick={() => {
                                    const item = {
                                        id: food._id,
                                        name: food.name,
                                        image: food.image,
                                        price: food.price,
                                        quantity,
                                        size: size[selectedSizeIndex].name,
                                        sizePrice: size[selectedSizeIndex].price,
                                        toppings: toppings
                                            .map((t, i) => ({ ...t, count: toppingCounts[i] }))
                                            .filter(t => t.count > 0),
                                        total: totalPrice,
                                    };
                                    addItem(item);
                                }}
                                className="bg-green-700 text-white px-6 py-2 rounded-xl shadow-md"
                            >
                                🛒 Thêm vào giỏ hàng: {totalPrice.toLocaleString()} ₫
                            </button>

                        </div>
                    </div>
                </div>


            </Modal>
        </>
    );
};

export default ModelF;


