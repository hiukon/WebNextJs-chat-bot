import { IBox } from 'app/types/backend';
import BoxDetail from './app.detailbox';


const getBoxBySlug = async (slug: string): Promise<IBox | null> => {
    const res = await fetch(`http://localhost:3000/api/boxes/slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
};

export default async function Page({ params }: { params: { slug: string } }) {
    const box = await getBoxBySlug(params.slug);
    if (!box) return <div className="p-6 text-red-600">Không tìm thấy sản phẩm đóng gói</div>;

    return <BoxDetail box={box} />;
}
