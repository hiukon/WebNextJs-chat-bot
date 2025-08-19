'use client';
import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import Link from 'next/link';

const Bar = () => {

    return (
        <div className='flex-1 block bg-white shadow-md mt-0.5 p-3 text-center text-gray-500 '>
            <Link className='m-9 font-semibold' href={'/'}> Trang chủ </Link>
            <Link className='m-9 font-semibold' href={'/menu'}> Menu </Link>
            <Link className='m-9 font-semibold' href={'/package'}> Sản Phẩm Đóng Gói </Link>
            <Link className='m-9 font-semibold' href={'/'}> Về Chúng Tôi</Link>
            <Link className='m-9 font-semibold' href={'/'}> Khuyến Mãi </Link>
            <Link className='m-9 font-semibold' href={'/'}> Hội Viên </Link>
        </div>
    );
};
export default Bar;