import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./CartContext";

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
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}