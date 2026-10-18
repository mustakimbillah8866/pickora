import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./CartContext";
import Header from "./Header";
import Footer from "./Footer";

export const metadata: Metadata = {
  title: "Pickora",
  description: "ঘরের সব প্রয়োজন, এক ঠিকানায়",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body>
        <CartProvider>
          <Header />
          <div className="min-h-screen bg-gray-50 text-gray-800">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}