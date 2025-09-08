'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Topping {
    name: string;
    price: number;
    count: number;
}

interface CartItem {
    id: string | undefined;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    sizePrice: number;
    toppings: Topping[];
    total: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            addItem: (item) =>
                set((state) => ({
                    items: [...state.items, item], // thêm vào mảng
                })),
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage', // lưu vào localStorage
        }
    )
);
