import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import InitialLoading from "./components/InitialLoading";
import { UserProvider } from "./components/UserContext";
import { CartProvider } from "./components/CartContext";

export const metadata: Metadata = {
  title: "Anchieta Pizzaria",
  description: "Anchieta Pizzaria - Trabalho de CC P1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-primary min-h-screen flex flex-col">
        <UserProvider>
          <CartProvider>
            <InitialLoading>
              <Header />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <Footer />
            </InitialLoading>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
