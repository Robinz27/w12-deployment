"use client";

import "./globals.css";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Login from "@/components/Login";
import { useCart } from "@/utils/cart";
import { products } from "@/utils/products";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const cartCount = useCart().length;

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Calculator", href: "/Calculator" },
    { label: "Animation", href: "/Animation" },
    { label: "Todos", href: "/Todos" },
    { label: `Products (${products.length - cartCount})`, href: "/Products" },
    { label: "Carts", href: "/Carts" },
  ];

  return (
    <html lang="th">
      <body className="min-h-screen flex flex-col">
        <Header />
        <Login />

        <nav
          className="mt-6 mb-6 flex flex-wrap justify-center gap-2 sm:gap-4"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const className = `relative rounded-md border border-blue-600 px-3 py-1.5 text-sm font-medium ${
              isActive ? "bg-blue-600 text-white" : "text-blue-600"
            }`;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={className}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
                {item.href === "/Carts" && (
                  <span className="absolute -top-2 -right-2 min-w-5 rounded-full bg-red-600 px-1.5 text-center text-xs leading-5 text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
