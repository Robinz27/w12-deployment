"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";

const accounts = ["user", "admin", "manager"];
const sessionKey = "csi205-demo-account";
const sessionEvent = "csi205-demo-login";
let currentAccount: string | null = null;

function getAccount() {
  try {
    const saved = sessionStorage.getItem(sessionKey);
    return saved && accounts.includes(saved) ? saved : null;
  } catch {
    return currentAccount;
  }
}

function subscribe(notify: () => void) {
  window.addEventListener(sessionEvent, notify);
  return () => window.removeEventListener(sessionEvent, notify);
}

function saveAccount(account: string | null) {
  currentAccount = account;
  try {
    if (account) sessionStorage.setItem(sessionKey, account);
    else sessionStorage.removeItem(sessionKey);
  } catch {
    // Keep the demo usable when browser storage is unavailable.
  }
  window.dispatchEvent(new Event(sessionEvent));
}

export default function Login() {
  const account = useSyncExternalStore(subscribe, getAccount, () => null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;
    if (account && modal.open) modal.close();
    if (!account && !modal.open) modal.showModal();
  }, [account]);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const username = String(data.get("username"))
      .trim()
      .toLowerCase()
      .replace(/@company\.com$/, "");

    if (!accounts.includes(username) || data.get("password") !== "pass") {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    setError("");
    form.reset();
    saveAccount(username);
  }

  return (
    <>
      {account && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-800">
            {account}@company.com
          </span>
          <button
            type="button"
            onClick={() => saveAccount(null)}
            className="rounded-md border border-slate-300 px-3 py-1 text-slate-800 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      )}

      <dialog
        ref={dialog}
        aria-labelledby="login-title"
        onCancel={(event) => event.preventDefault()}
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={handleLogin} className="space-y-3">
          <h1 id="login-title" className="mb-4 text-center text-lg font-bold">
            Who are you?
          </h1>

          <label className="flex items-center gap-2 rounded-md border border-slate-300 px-3 focus-within:border-blue-600">
            <span className="sr-only">ชื่อผู้ใช้</span>
            <input
              name="username"
              autoComplete="username"
              placeholder="user | admin | manager"
              required
              className="min-w-0 flex-1 py-2 text-sm outline-none"
            />
            <span aria-hidden="true" className="text-xs text-slate-600">
              @company.com
            </span>
          </label>

          <label className="block">
            <span className="sr-only">รหัสผ่าน</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="pass"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
            >
              Login
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
