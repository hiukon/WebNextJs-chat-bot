

import ChatWindow from './ai/ChatWindow';
import Header from './header/app.header';
import HomePage from './home/page';
import Shopping from './shopping_cart/page';

async function getFoods() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/foods`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch foods');
  return res.json();
}

export default async function Page() {
  let foods = [];
  let hasError = false;

  try {
    foods = await getFoods();
  } catch {
    hasError = true;
  }

  return (
    <div>
      {hasError && (
        <div className="w-[77%] max-w-screen-2xl mx-auto mt-4">Lỗi khi tải dữ liệu</div>
      )}
      {Array.isArray(foods) && foods.length > 0 && <HomePage food={foods} />}
    </div>
  );
}
