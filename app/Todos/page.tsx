"use client";

import { useEffect, useMemo, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=50";

export default function TodosPage() {
  const [todosRaw, setTodosRaw] = useState<Todo[]>([]);
  const [onlyWaiting, setOnlyWaiting] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [curPage, setCurPage] = useState(1);
  const [newTitle, setNewTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nextId, setNextId] = useState(51);

  const [request, setRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetch(API_URL, { signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("ไม่สามารถโหลดรายการงานได้");

        const data: Todo[] = await response.json();
        if (signal.aborted) return;

        setTodosRaw(data);
        setNextId(Math.max(0, ...data.map((todo) => todo.id)) + 1);
      })
      .catch(() => {
        if (!signal.aborted) {
          setError("โหลดข้อมูลออนไลน์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        }
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [request]);

  const todos = useMemo(
    () => todosRaw.filter((todo) => !onlyWaiting || !todo.completed),
    [todosRaw, onlyWaiting],
  );

  const numPages = Math.max(1, Math.ceil(todos.length / itemsPerPage));

  const safePage = Math.min(curPage, numPages);

  const pageTodos = todos.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage,
  );

  if (curPage !== safePage) {
    setCurPage(safePage);
  }

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newTitle.trim();

    if (!title) return;

    setTodosRaw((current) => [
      { id: nextId, title, completed: false },
      ...current,
    ]);

    setNextId((id) => id + 1);
    setNewTitle("");
    setShowAddForm(false);
    setCurPage(1);
  };

  const deleteClick = (id: number) => {
    setTodosRaw((current) => current.filter((todo) => todo.id !== id));
  };

  const waitingClick = (id: number) => {
    setTodosRaw((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const pageButtonClass =
    "rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-medium text-blue-500 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40";

  const getPageNumbers = (): (number | "...")[] => {
    if (numPages <= 5) {
      return Array.from({ length: numPages }, (_, index) => index + 1);
    }

    if (safePage <= 3) {
      return [1, 2, 3, "...", numPages];
    }

    if (safePage >= numPages - 2) {
      return [1, "...", numPages - 2, numPages - 1, numPages];
    }

    return [1, "...", safePage - 1, safePage, safePage + 1, "...", numPages];
  };

  return (
    <div className="bg-white px-3 py-2 text-slate-800 sm:px-6">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={onlyWaiting}
              onClick={() => {
                setOnlyWaiting((value) => !value);
                setCurPage(1);
              }}
              className={`relative h-7 w-[38px] rounded-full border transition ${
                onlyWaiting
                  ? "border-blue-600 bg-blue-600"
                  : "border-slate-300 bg-white"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full transition ${
                  onlyWaiting ? "left-[19px] bg-white" : "left-1 bg-slate-400"
                }`}
              />
            </button>

            <span className="text-sm">Show only</span>

            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-400 px-3 py-2.5 font-medium text-black">
              waiting <span aria-hidden="true">◷</span>
            </span>
          </div>

          <label className="sr-only" htmlFor="itemsPerPage">
            จำนวนรายการต่อหน้า
          </label>

          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(event) => {
              setItemsPerPage(Number(event.target.value));
              setCurPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm sm:w-[275px]"
          >
            <option value={5}>5 items per page</option>
            <option value={10}>10 items per page</option>
            <option value={50}>50 items per page</option>
          </select>
        </div>

        <section className="overflow-hidden border border-slate-200 bg-white shadow-md">
          {showAddForm && (
            <form
              onSubmit={addTodo}
              className="flex flex-col gap-2 border-b border-slate-200 bg-blue-50 p-4 sm:flex-row"
            >
              <label htmlFor="newTodo" className="sr-only">
                ชื่องานใหม่
              </label>

              <input
                id="newTodo"
                autoFocus
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="พิมพ์ชื่องานที่ต้องการเพิ่ม..."
                maxLength={200}
                className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                บันทึกงาน
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewTitle("");
                }}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-100"
              >
                ยกเลิก
              </button>
            </form>
          )}

          {error && (
            <div className="m-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}{" "}
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError("");
                  setRequest((value) => value + 1);
                }}
                className="ml-2 underline"
              >
                ลองใหม่
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse text-left">
              <thead className="bg-[#23272b] text-white">
                <tr>
                  <th className="w-20 px-5 py-2 font-bold sm:px-7">ID</th>

                  <th className="px-5 py-2 text-center font-bold sm:text-left">
                    Title
                  </th>

                  <th className="w-36 px-2 py-2 text-center font-bold">
                    Completed
                  </th>

                  <th className="w-14 px-2 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => setShowAddForm((show) => !show)}
                      className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-2xl font-normal text-white hover:bg-blue-700"
                      aria-label="เพิ่มงาน"
                      title="เพิ่มงาน"
                    >
                      {showAddForm ? "×" : "+"}
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      กำลังโหลดรายการงาน...
                    </td>
                  </tr>
                ) : pageTodos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      ไม่พบรายการงาน
                    </td>
                  </tr>
                ) : (
                  pageTodos.map((todo, index) => (
                    <tr
                      key={todo.id}
                      className={index % 2 === 0 ? "bg-[#f1f1f1]" : "bg-white"}
                    >
                      <td className="px-5 py-3 sm:px-7">
                        <span className="inline-flex min-w-6 justify-center rounded-md bg-slate-500 px-2 py-1 text-xs font-bold text-white">
                          {todo.id}
                        </span>
                      </td>

                      <td className="max-w-0 px-4 py-3 text-slate-900">
                        {todo.title}
                      </td>

                      <td className="px-2 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => waitingClick(todo.id)}
                          aria-label={
                            todo.completed
                              ? `เปลี่ยน ${todo.title} เป็น waiting`
                              : `ทำ ${todo.title} ให้เสร็จ`
                          }
                          className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition hover:brightness-95 ${
                            todo.completed
                              ? "bg-emerald-600 text-white"
                              : "bg-amber-400 text-black"
                          }`}
                        >
                          {todo.completed ? "done ✓" : "waiting ◷"}
                        </button>
                      </td>

                      <td className="px-2 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => deleteClick(todo.id)}
                          aria-label={`ลบ ${todo.title}`}
                          title="ลบงาน"
                          className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-600 text-white transition hover:bg-rose-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v5M14 11v5" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-4 flex flex-col items-center gap-3">
          <nav
            aria-label="Pagination"
            className="flex max-w-full flex-wrap items-center justify-center gap-1.5"
          >
            <button
              type="button"
              className={pageButtonClass}
              disabled={safePage <= 1}
              onClick={() => setCurPage(1)}
            >
              First
            </button>

            <button
              type="button"
              className={pageButtonClass}
              disabled={safePage <= 1}
              onClick={() => setCurPage((page) => Math.max(1, page - 1))}
            >
              Previous
            </button>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1 py-2 text-sm text-slate-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  aria-current={safePage === page ? "page" : undefined}
                  onClick={() => setCurPage(page)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    safePage === page
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-blue-300 bg-white text-blue-500 hover:bg-blue-50"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              className={pageButtonClass}
              disabled={safePage >= numPages}
              onClick={() => setCurPage((page) => Math.min(numPages, page + 1))}
            >
              Next
            </button>

            <button
              type="button"
              className={pageButtonClass}
              disabled={safePage >= numPages}
              onClick={() => setCurPage(numPages)}
            >
              Last
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
