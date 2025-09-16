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
    id?: string | undefined;
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


interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    role: string;
}

interface UserState {
    currentUser: User | null;
    setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            currentUser: null,
            setUser: (user) => set({ currentUser: user }),
        }),
        { name: 'user-storage' }
    )
);



export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            addItem: (item) =>
                set((state) => {
                    // Tạo id duy nhất dựa vào productId + size + toppings
                    const uniqueId = `${item.productId}-${item.size}-${item.toppings.map(t => t.name).join('-')}`;

                    // Kiểm tra xem item này đã có trong giỏ chưa
                    const existing = state.items.find(i => i.id === uniqueId);

                    if (existing) {
                        // Nếu đã có thì cộng dồn quantity và total
                        return {
                            items: state.items.map(i =>
                                i.id === uniqueId
                                    ? { ...i, quantity: i.quantity + item.quantity, total: i.total + item.total }
                                    : i
                            ),
                        };
                    }

                    // Nếu chưa có thì thêm mới
                    return { items: [...state.items, { ...item, id: uniqueId }] };
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
