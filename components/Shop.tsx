"use client";

import Image from "next/image";
import Link from "next/link";
import { updateCart, useCart } from "@/utils/cart";
import { formatPrice, products } from "@/utils/products";

export default function Shop({ cartOnly = false }: { cartOnly?: boolean }) {
  const cart = useCart();
  const selected = new Set(cart);
  const shown = products.filter(
    (product) => selected.has(product.id) === cartOnly,
  );
  const title = cartOnly ? "Carts" : "Products";

  return (
    <section
      className="mx-auto w-full max-w-5xl px-3 sm:px-5"
      aria-label={title}
    >
      {shown.length > 0 ? (
        <div
          className="max-h-[55vh] overflow-y-auto rounded-xl border border-cyan-900/30 bg-cyan-50 p-2.5"
          role="region"
          aria-label={cartOnly ? "สินค้าในตะกร้า" : "รายการสินค้า"}
          tabIndex={0}
        >
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
            {shown.map((product, index) => (
              <li
                key={product.id}
                className={`overflow-hidden rounded-xl border ${cartOnly ? "border-red-300 bg-red-50" : "border-emerald-300 bg-emerald-50"}`}
              >
                <div className="relative aspect-square overflow-hidden bg-linear-to-br from-slate-700 via-cyan-900 to-slate-950">
                  <Image
                    src={`https://picsum.photos/seed/csi205-${product.id}/320/320`}
                    alt=""
                    fill
                    unoptimized
                    loading={index < 10 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 50vw, 190px"
                    className="object-cover"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                  <span className="absolute top-1.5 right-1.5 rounded-full bg-black/75 px-2 py-0.5 text-xs font-semibold text-white">
                    {formatPrice(product.cents)}
                  </span>
                  <p className="absolute inset-x-0 bottom-0 bg-black/75 px-2 py-1.5 text-xs leading-snug text-white">
                    {product.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateCart(product.id, !cartOnly)}
                  aria-label={`${cartOnly ? "Remove" : "Add to Carts"}: ${product.name}`}
                  className={`w-full px-1 py-2 text-sm font-semibold ${cartOnly ? "text-red-700 hover:bg-red-100" : "text-emerald-800 hover:bg-emerald-100"}`}
                >
                  {cartOnly ? "Remove" : "Add to Carts"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-xl border border-cyan-900/30 bg-cyan-50 px-4 py-12 text-center text-slate-800">
          <p className="font-semibold">
            {cartOnly
              ? "ตะกร้ายังไม่มีสินค้า"
              : "สินค้าทั้งหมดอยู่ในตะกร้าแล้ว"}
          </p>
          <Link
            href={cartOnly ? "/Products" : "/Carts"}
            className="mt-2 inline-block text-blue-700 underline"
          >
            {cartOnly ? "ไปที่หน้า Products" : "ไปที่หน้า Carts"}
          </Link>
        </div>
      )}

      {cartOnly && (
        <p
          className="mt-2 flex flex-wrap justify-center gap-2 text-sm font-bold"
          aria-live="polite"
        >
          <span className="rounded-full bg-amber-300 px-3 py-1 text-amber-950">
            Count: {shown.length} items
          </span>
          <span className="rounded-full bg-red-600 px-3 py-1 text-white">
            Price:{" "}
            {formatPrice(
              shown.reduce((total, product) => total + product.cents, 0),
            )}
          </span>
        </p>
      )}
    </section>
  );
}
