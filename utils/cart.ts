"use client";

import { useMemo, useSyncExternalStore } from "react";
import { products } from "./products";

const storageKey = "csi205-cart";
const changeEvent = "csi205-cart-change";
const productIds = new Set(products.map((product) => product.id));
let fallback: string | null = null;

function readCart() {
  if (fallback !== null) return fallback;
  try {
    return localStorage.getItem(storageKey) ?? "[]";
  } catch {
    return "[]";
  }
}

function parseCart(raw: string): number[] {
  try {
    const ids: unknown = JSON.parse(raw);
    return Array.isArray(ids)
      ? [
          ...new Set(
            ids.filter(
              (id): id is number =>
                typeof id === "number" && productIds.has(id),
            ),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}

function subscribe(notify: () => void) {
  window.addEventListener(changeEvent, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(changeEvent, notify);
    window.removeEventListener("storage", notify);
  };
}

export function useCart() {
  const snapshot = useSyncExternalStore(subscribe, readCart, () => "[]");
  return useMemo(() => parseCart(snapshot), [snapshot]);
}

export function updateCart(id: number, add: boolean) {
  const ids = new Set(parseCart(readCart()));
  if (add) ids.add(id);
  else ids.delete(id);

  const next = JSON.stringify([...ids]);
  try {
    localStorage.setItem(storageKey, next);
    fallback = null;
  } catch {
    fallback = next;
  }
  window.dispatchEvent(new Event(changeEvent));
}
