'use client';
import AIPage from './ai/page';
import './globals.css';
import Header from './header/app.header';
import Shopping from './shopping_cart/page';
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noHeaderRoutes = ["/login", "/register"];
  const noAIRoutes = ["/login", "/register"];
  const noShopRoutes = ["/login", "/register"];
  const hideHeader = noHeaderRoutes.includes(pathname);
  const hideAI = noAIRoutes.includes(pathname);
  const hideShop = noShopRoutes.includes(pathname);
  return (
    <html lang="vi">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0"
        />
      </head>
      <body>
        {!hideHeader && <Header />}
        {children}
        {!hideAI && <AIPage />}
        {!hideShop && <Shopping />}
      </body>
    </html>
  );
}