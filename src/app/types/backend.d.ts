export interface IFood {
    _id?: string;
    name: string;
    image: string;
    price: number;
    description: string;
    category: string;
    slug: { type: String, required: true, unique: true },
    createdAt?: string;
    updatedAt?: string;
}
export interface IBox {
    _id?: string;
    name: string;
    image: string;
    price: number;
    description?: string;
    category: string;
    slug: { type: String, required: true, unique: true },
}
interface ICartItem {
    [x: string]: any;
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    sizePrice: number;
    toppings: { name: string; price: number; count: number }[];
    total: number;
}