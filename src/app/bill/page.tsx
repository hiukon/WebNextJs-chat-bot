'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ICartItem } from '../types/backend';


const Checkout = () => {
    const [cart, setCart] = useState<ICartItem | null>(null);
    const [payment, setPayment] = useState<string>('card');
    const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
    const [agreed, setAgreed] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem("cart");
        if (data) {
            setCart(JSON.parse(data));
        }
    }, []);
    if (!cart) return <div>loading</div>;
    const toppingText = cart.toppings.map(t => `${t.name} x${t.count}`).join(', ');
    const handleCheckout = async () => {
        if (!cart) return;

        const orderData = {
            userId: '1',
            paymentMethod: payment,
            items: [
                {
                    productId: cart.productId,
                    productName: cart.name,
                    productImage: cart.image,
                    quantity: cart.quantity || 1,
                    unitPrice: cart.price,
                    totalPrice: cart.total,
                    options: {
                        size: cart.size,
                        toppings: cart.toppings.map(t => t.name),
                    },
                },
            ],
        };

        try {
            const res = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            const data = await res.json();

            if (res.ok) {
                alert(' Đặt hàng thành công!');
                localStorage.removeItem('cart');
            } else {
                alert(` Lỗi: ${data.message}`);
            }
        } catch (error) {
            console.error('Lỗi khi gửi đơn hàng:', error);
            alert('Gửi đơn hàng thất bại!');
        }
    };


    return (
        <div className="flex flex-col md:flex-row p-6 justify-center mt-8">

            <div className='w-full md:w-1/3 h-[700px] pr-4 space-y-6 border border-black rounded-lg p-4 m-3'>
                <header className='flex items-center justify-between bg-white    '>
                    <button onClick={() => setMode('delivery')} className={`items-center justify-between w-[50%] ${mode === 'delivery' ? 'border-b-4 border-green-600' : ''} p-2`}>
                        <p className='hover:text-green-700 font-semibold text-gray-500'>Giao Hàng</p>
                    </button>
                    <button onClick={() => setMode('pickup')} className={`items-center justify-between w-[50%]  p-2 ${mode === 'pickup' ? 'border-b-4 border-green-600' : ''} p-2`}>
                        <p className='hover:text-green-700 font-semibold text-gray-500'> Đến Lấy</p>
                    </button>
                </header>
                {mode === 'delivery' && (
                    <div className='m-4 flex-1'>
                        <div className='mb-4' >
                            <h3 className="text-xl text-green-700 " > Địa chỉ</h3>
                            <p>11 P. Nguyễn Hữu Huân, Lý Thái Tổ, Hoàn Kiếm, Hà Nội, Vietnam</p>
                        </div>
                        <div className='mb-4'>
                            <p className=' text-green-700'>Trần Hiếu</p>
                            <p> Số điện thoại: 0353719778</p>
                        </div>
                        <div className='mb-4'>
                            <h3 className="text-xl  text-green-700"> Thời gian nhận hàng</h3>
                            <p>Chọn thời gian giao hàng</p>
                        </div>
                        <div className='mb-4'>
                            <h3 className="text-xl  text-green-700"> Ghi chú</h3>
                            <input type="text" className="w-full border p-2 rounded" placeholder="Ghi chú cho cửa hàng..." />
                        </div>
                        <div className='mb-4'>
                            <h3 className=" text-xl  text-green-700"> Hóa đơn VAT</h3>
                            <p className="text-sm text-gray-700">- Vui lòng xem hướng dẫn xuất hóa đơn từ hóa đơn giấy đi kèm món nước.</p>
                            <p className="text-sm text-gray-700">- Trường hợp không nhận được hoá đơn giấy, vui lòng liên hệ Hotline CSKH: 1900234518 (nhấn phím 1) hoặc Fanpage: Phuc Long Coffee & Tea từ 8h00 - 17h45 để được hỗ trợ nhé</p>
                        </div>
                    </div>
                )}
                {mode === 'pickup' && (
                    <div className='m-4 flex-1'>
                        <div className='mb-4'>
                            <p className="font-semibold text-green-700">BDG-CH 44 Nguyen Dinh Chieu P.PC</p>
                            <p className="text-gray-700">
                                Địa chỉ: 44 Nguyễn Đình Chiểu, P. Phú Cường, TP. Thủ Dầu Một, T. Bình Dương
                            </p>
                            <p className="text-gray-700">Số điện thoại: (028) 7100 1968 (Ext.20028)</p>
                            <p className="text-gray-700">Giờ hoạt động: 07:00 - 22:30</p>
                            <p className="text-green-600 font-semibold">Trạng thái hoạt động: Mở cửa</p>
                        </div>
                        <div className='mb-4'>
                            <p className=' text-green-700'>Trần Hiếu</p>
                            <p> Số điện thoại: 0353719778</p>
                        </div>
                        <div className='mb-4'>
                            <h3 className="text-xl  text-green-700"> Thời gian nhận hàng</h3>
                            <p>Chọn thời gian giao hàng</p>
                        </div>
                        <div className='mb-4'>
                            <h3 className="text-xl  text-green-700"> Ghi chú</h3>
                            <input type="text" className="w-full border p-2 rounded" placeholder="Ghi chú cho cửa hàng..." />
                        </div>
                        <div className='mb-4'>
                            <h3 className=" text-xl  text-green-700"> Hóa đơn VAT</h3>
                            <p className="text-sm text-gray-700">- Vui lòng xem hướng dẫn xuất hóa đơn từ hóa đơn giấy đi kèm món nước.</p>
                            <p className="text-sm text-gray-700">- Trường hợp không nhận được hoá đơn giấy, vui lòng liên hệ Hotline CSKH: 1900234518 (nhấn phím 1) hoặc Fanpage: Phuc Long Coffee & Tea từ 8h00 - 17h45 để được hỗ trợ nhé</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full md:w-1/3 h-[700px] pr-4 space-y-6 border border-black rounded-lg p-4 m-3">
                <h3 className="text-lg font-bold text-green-700 border-b-2 border-gray-300 mt-3">🛒 Giỏ hàng của bạn</h3>
                <div className="flex items-center  space-x-4 ">
                    <Image src={cart.image} alt={cart.name} width={80} height={80} />
                    <div className=''>
                        <p>{cart.name} (Size {cart.size})</p>
                        <p className="text-sm text-gray-500">{toppingText}</p>
                        <p className="font-semibold">{cart.total.toLocaleString()} ₫</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="font-semibold text-green-700 ">Thông tin thanh toán</h4>
                    <p>Tổng tiền tạm tính: {cart.total.toLocaleString()} ₫</p>
                    <p>Phí vận chuyển:  ₫</p>
                    <p>Mã giảm giá:  ₫</p>
                    <p>Tổng tiền:  ₫</p>
                </div>

                <div className="mt-6">
                    <h4 className="font-semibold text-green-700">Phương thức thanh toán</h4>
                    <div className="space-y-2 mt-2">
                        <label className="block">
                            <input type="radio" name="payment" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
                            {' '}Thanh toán khi nhận hàng
                        </label>
                        <label className="block">
                            <input type="radio" name="payment" checked={payment === 'card'} onChange={() => setPayment('card')} />
                            {' '}Thẻ ngân hàng/Thẻ tín dụng
                        </label>
                        <label className="block">
                            <input type="radio" name="payment" checked={payment === 'momo'} onChange={() => setPayment('momo')} />
                            {' '}Ví MoMo
                        </label>
                        <label className="block">
                            <input type="radio" name="payment" checked={payment === 'zalo'} onChange={() => setPayment('zalo')} />
                            {' '}Ví ZaloPay
                        </label>
                        <label className="block">
                            <input type="radio" name="payment" checked={payment === 'shopee'} onChange={() => setPayment('shopee')} />
                            {' '}Ví ShopeePay
                        </label>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
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
                        className={`mt-4 w-full py-2 rounded-lg font-bold shadow
    ${agreed ? 'bg-green-700 text-white' : 'bg-gray-300 text-white cursor-not-allowed'}
  `}
                    >
                        Tiến hành thanh toán
                    </button>

                </div>
            </div>
        </div>
    );
};


export default Checkout;
