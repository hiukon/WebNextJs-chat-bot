'use client';
import React, { useState, useMemo, Children, } from 'react';
import { ConfigProvider, Menu } from 'antd';
import { AppstoreOutlined, IeSquareFilled } from '@ant-design/icons';
import { IFood } from '../types/backend';
import Image from 'next/image';

interface IProps {
    foods: IFood[];
    onCategoryChange: (category: string) => void;
}
const AntdMenu = ({ foods, onCategoryChange }: IProps) => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);
    const [openKeys, setOpenKeys] = useState<string[]>(['sub1']);
    const categories = useMemo(() => {
        if (!foods) return [];
        const seen = new Set<string>();
        return foods
            .filter(food => {
                const cat = food.category.trim().toLowerCase();
                if (seen.has(cat)) return false;
                seen.add(cat);
                return true;
            })
            .map((food, index) => ({
                key: `cat-${index}`,
                label: food.category,
            }));
    }, [foods]);
    const onClick = (e: any) => {
        setSelectedKeys([e.key]);
        if (e.key === '1') {
            onCategoryChange('Tất cả');
        } else if (e.key.startsWith('cat-')) {
            const idx = parseInt(e.key.replace('cat-', ''), 10);
            onCategoryChange(categories[idx]?.label || 'Tất cả');
        }
    };

    const items = [
        {
            key: 'sub1',
            label: 'Menu',
            icon: <AppstoreOutlined />,
            children: [
                { key: '1', label: 'Tất cả' },
                {
                    key: 'sub2',
                    label: 'Phân loại',
                    children: categories,
                },

            ],
        },
    ];

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: 'rgb(50, 177, 25)',
                },
            }}
        >
            <Menu
                onClick={onClick}
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onOpenChange={setOpenKeys}
                style={{
                    width: 200,
                    paddingBottom: 30,
                    marginLeft: 150,
                    marginTop: 80,
                    border: '1px solid rgb(235, 235, 235)',
                    borderRadius: 8,
                    fontSize: 16,
                }}
                mode="inline"
                items={items}
            />
        </ConfigProvider>
    );
};

export default AntdMenu;