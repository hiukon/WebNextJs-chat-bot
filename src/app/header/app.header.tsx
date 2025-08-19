'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';
import { CodeSandboxOutlined, DropboxOutlined } from '@ant-design/icons';
import Model from "./app.model";
import Link from 'next/link';
import Bar from "./app.bar";
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';


const iconList = [
    '/icons/logo3.png',
    '/icons/logo5.png',
];
const Header = () => {
    return (
        <>
            <div className='flex items-center bg-white shadow-lg '>
                <Icon />
                <SearchBar />
                <Model />
            </div>
            <div >
                <Bar />
            </div>
        </>
    );
};
const Icon = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % iconList.length);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="ml-[15%]">
            <Link href="/" >
                <div>
                    <Image
                        src={iconList[currentIndex]}
                        alt={`icon-${currentIndex}`}
                        width={70}
                        height={70} />
                </div>
            </Link>
        </div>
    );
};
const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmed = query.trim();

        if (!trimmed) {
            setError('Vui lòng nhập từ khóa tìm kiếm.');
            return;
        }

        if (trimmed.length > 20) {
            setError('Tối đa 20 ký tự cho từ khóa tìm kiếm.');
            return;
        }

        setError('');
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    };

    const handleClear = () => {
        setQuery('');
        setError('');
    };

    return (
        <div className="m-4 flex-1 max-w-sm">
            <form onSubmit={handleSearch} className="relative">
                <input
                    className={`w-full h-10 px-10 pr-10 border ${error ? 'border-red-500' : 'border-gray-300'
                        } rounded-3xl bg-gray-100 focus:border-green-500 focus:outline-none`}
                    type="text"
                    placeholder="Bạn muốn mua gì..."
                    value={query}
                    maxLength={20}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (error) setError('');
                    }}
                />
                <SearchOutlined
                    onClick={handleSearch}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                />
                {query && (
                    <CloseCircleOutlined
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer"
                    />
                )}
            </form>


            {error && <p className="text-red-500 text-sm mt-1 ml-2">{error}</p>}
        </div>
    );
};



export default Header;