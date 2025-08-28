import AIPage from './ai/page';
import './globals.css';
import Header from './header/app.header';
import Shopping from './shopping_cart/page';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0"
        />
      </head>
      <body>
        <Header />
        {children}
        <AIPage />
        <Shopping />
      </body>
    </html>
  );
}