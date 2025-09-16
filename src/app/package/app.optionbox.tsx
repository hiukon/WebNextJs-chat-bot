'use client';
import React, { useState, useMemo } from 'react';
import { ConfigProvider, Menu } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import { IBox } from '../types/backend';

interface IProps {
    boxes: IBox[];
    onCategoryChange: (category: string) => void;
}
const AntdMenuBox = ({ boxes, onCategoryChange }: IProps) => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);
    const [openKeys, setOpenKeys] = useState<string[]>(['sub1']);
    const categories = useMemo(() => {
        if (!boxes) return [];
        const seen = new Set<string>();
        return boxes
            .filter(boxes => {
                const cat = boxes.category.trim().toLowerCase();
                if (seen.has(cat)) return false;
                seen.add(cat);
                return true;
            })
            .map((boxes, index) => ({
                key: `cat-${index}`,
                label: boxes.category,
            }));
    }, [boxes]);
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

export default AntdMenuBox;