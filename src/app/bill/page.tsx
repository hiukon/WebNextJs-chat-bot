'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from './cartStore';

const Checkout = () => {
    const [payment, setPayment] = useState('card');
    const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
    const [agreed, setAgreed] = useState(false);
    const { items, removeItem } = useCartStore();
    const total = items.reduce((sum, item) => sum + item.total, 0);
    const handleCheckout = async () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            alert("Bạn cần đăng nhập để đặt hàng.");
            return;
        }
        const currentUser = JSON.parse(userStr);
        console.log("Current User Parsed:", currentUser);

        const orderData = {
            userId: currentUser.userId,
            paymentMethod: payment,
            items: items.map(item => ({
                productId: item.productId,
                productName: item.name,
                productImage: item.image,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.total,
                options: {
                    size: item.size,
                    toppings: item.toppings.map(t => t.name),
                },
            })),

        };
        console.log("Order Data:", orderData);
        try {
            const res = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Đặt hàng thành công!");
                localStorage.removeItem("cart");
            } else {
                alert(`Lỗi: ${data.message}`);
            }
        } catch (error) {
            console.error("Lỗi khi gửi đơn hàng:", error);
            alert("Gửi đơn hàng thất bại!");
        }
    };


    return (
        <div className="flex flex-col md:flex-row p-6 justify-center mt-8">

            <div className="w-full md:w-1/3 h-[700px] pr-4 space-y-6 border border-black rounded-lg p-4 m-3">
                <header className="flex items-center justify-between">
                    <button
                        onClick={() => setMode('delivery')}
                        className={`w-1/2 p-2 ${mode === 'delivery' ? 'border-b-4 border-green-600' : ''}`}
                    >
                        <p className="hover:text-green-700 font-semibold text-gray-500">Giao Hàng</p>
                    </button>
                    <button
                        onClick={() => setMode('pickup')}
                        className={`w-1/2 p-2 ${mode === 'pickup' ? 'border-b-4 border-green-600' : ''}`}
                    >
                        <p className="hover:text-green-700 font-semibold text-gray-500">Đến Lấy</p>
                    </button>
                </header>

                {mode === 'delivery' && (
                    <div className="m-4 flex-1 space-y-4">
                        <div>
                            <h3 className="text-xl text-green-700">Địa chỉ</h3>
                            <p>11 P. Nguyễn Hữu Huân, Lý Thái Tổ, Hoàn Kiếm, Hà Nội, Vietnam</p>
                        </div>
                        <div>
                            <p className="text-green-700">Trần Hiếu</p>
                            <p>Số điện thoại: 0353719778</p>
                        </div>
                        <div>
                            <h3 className="text-xl text-green-700">Thời gian nhận hàng</h3>
                            <p>Chọn thời gian giao hàng</p>
                        </div>
                        <div>
                            <h3 className="text-xl text-green-700">Ghi chú</h3>
                            <input type="text" className="w-full border p-2 rounded" placeholder="Ghi chú cho cửa hàng..." />
                        </div>
                        <div>
                            <h3 className="text-xl text-green-700">Hóa đơn VAT</h3>
                            <p className="text-sm text-gray-700">- Vui lòng xem hướng dẫn xuất hóa đơn từ hóa đơn giấy đi kèm món nước.</p>
                            <p className="text-sm text-gray-700">- Trường hợp không nhận được hoá đơn giấy, vui lòng liên hệ Hotline CSKH: 1900234518.</p>
                        </div>
                    </div>
                )}

                {mode === 'pickup' && (
                    <div className="m-4 flex-1 space-y-4">
                        <div>
                            <p className="font-semibold text-green-700">BDG-CH 44 Nguyen Dinh Chieu P.PC</p>
                            <p className="text-gray-700">Địa chỉ: 44 Nguyễn Đình Chiểu, P. Phú Cường, TP. Thủ Dầu Một, T. Bình Dương</p>
                            <p className="text-gray-700">Số điện thoại: (028) 7100 1968 (Ext.20028)</p>
                            <p className="text-gray-700">Giờ hoạt động: 07:00 - 22:30</p>
                            <p className="text-green-600 font-semibold">Trạng thái hoạt động: Mở cửa</p>
                        </div>
                        <div>
                            <p className="text-green-700">Trần Hiếu</p>
                            <p>Số điện thoại: 0353719778</p>
                        </div>
                        <div>
                            <h3 className="text-xl text-green-700">Thời gian nhận hàng</h3>
                            <p>Chọn thời gian giao hàng</p>
                        </div>
                        <div>
                            <h3 className="text-xl text-green-700">Ghi chú</h3>
                            <input type="text" className="w-full border p-2 rounded" placeholder="Ghi chú cho cửa hàng..." />
                        </div>
                        <div>
                            <h3 className="text-xl text-green-700">Hóa đơn VAT</h3>
                            <p className="text-sm text-gray-700">- Vui lòng xem hướng dẫn xuất hóa đơn từ hóa đơn giấy đi kèm món nước.</p>
                            <p className="text-sm text-gray-700">- Trường hợp không nhận được hoá đơn giấy, vui lòng liên hệ Hotline CSKH: 1900234518.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* --- RIGHT PANEL: CART + PAYMENT --- */}
            <div className="w-full md:w-1/3 h-[700px] pr-4 space-y-6 border border-black rounded-lg p-4 m-3">
                <h3 className="text-lg font-bold text-green-700 border-b-2 border-gray-300 mt-3">🛒 Giỏ hàng của bạn</h3>
                <div className="flex items-center space-x-4">
                    {items.length === 0 ? (
                        <p>Giỏ hàng trống</p>
                    ) : (
                        <div>
                            {items.map((item, idx) => {
                                const toppingText = item.toppings.map(t => `${t.name} x${t.count}`).join(', ');
                                return (
                                    <div key={idx} className="flex items-center space-x-4">
                                        <Image src={item.image} alt={item.name} width={80} height={80} />
                                        <div>
                                            <p>{item.name} (Size {item.size})</p>
                                            <p className="text-sm text-gray-500">{toppingText}</p>
                                            <p className="font-semibold">{item.total.toLocaleString()} ₫</p>
                                        </div>

                                        <button
                                            className="material-symbols-rounded text-red-500 mr-auto"
                                            onClick={() => removeItem(item.id!)}
                                        >
                                            delete
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <h4 className="font-semibold text-green-700">Thông tin thanh toán</h4>
                    <p>Tổng tiền tạm tính: {total.toLocaleString()} ₫</p>
                    <p>Phí vận chuyển: ₫</p>
                    <p>Mã giảm giá: ₫</p>
                    <p>Tổng tiền: {total.toLocaleString()} ₫</p>
                </div>

                <div className="mt-6">
                    <h4 className="font-semibold text-green-700">Phương thức thanh toán</h4>
                    <div className="space-y-2 mt-2">
                        {['cod', 'card', 'momo', 'zalo', 'shopee'].map(method => (
                            <label key={method} className="block">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={payment === method}
                                    onChange={() => setPayment(method)}
                                />{' '}
                                {method === 'cod' && 'Thanh toán khi nhận hàng'}
                                {method === 'card' && 'Thẻ ngân hàng/Thẻ tín dụng'}
                                {method === 'momo' && 'Ví MoMo'}
                                {method === 'zalo' && 'Ví ZaloPay'}
                                {method === 'shopee' && 'Ví ShopeePay'}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                        <span>
                            Tôi đồng ý với{' '}
                            <a href="#" className="text-green-700 underline">
                                điều khoản và chính sách
                            </a>
                        </span>
                    </label>

                    <button
                        disabled={!agreed}
                        onClick={handleCheckout}
                        className={`mt-4 w-full py-2 rounded-lg font-bold shadow ${agreed ? 'bg-green-700 text-white' : 'bg-gray-300 text-white cursor-not-allowed'
                            }`}
                    >
                        Tiến hành thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
