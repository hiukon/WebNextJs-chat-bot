'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Topping {
    name: string;
    price: number;
    count: number;
}

interface CartItem {
    userId: any;
    productId: any;
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
                set((state) => {
                    // tạo id duy nhất dựa vào productId + size + toppings
                    const uniqueId = `${item.productId}-${item.size}-${item.toppings.map(t => t.name).join('-')}`;

                    const newItem = { ...item, id: uniqueId };

                    return {
                        items: [...state.items, newItem],
                    };
                }),
            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'cart-storage',
        }

    )

);
