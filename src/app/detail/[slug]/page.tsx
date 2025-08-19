import { IFood } from 'app/types/backend';
import Detail from './app.detail';


const getProductBySlug = async (slug: string): Promise<IFood | null> => {
    const res = await fetch(`http://localhost:3000/api/foods/slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
};

export default async function Page({ params }: { params: { slug: string } }) {
    const food = await getProductBySlug(params.slug);
    if (!food) return <div className="p-6 text-red-600">Không tìm thấy sản phẩm</div>;

    return <Detail food={food} />;
}
