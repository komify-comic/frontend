"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark, Clock3, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type BookmarkComic = {
  id: string;
  title: string;
  seo_slug: string | null;
  cover_path: string | null;
  alternative_title: string | null;
  category_id: string | null;
};

type BookmarkItem = {
  comic_id: string;
  created_at: string;
  comics: BookmarkComic;
};

export default function BookmarkPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(`${baseUrl}/bookmarks`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch bookmarks");
        }

        const data = await response.json();
        setBookmarks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [baseUrl]);

  const removeBookmark = async (comicId: string) => {
    try {
      const response = await fetch(`${baseUrl}/bookmarks/${comicId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete bookmark");
      }

      setBookmarks((prev) => prev.filter((x) => x.comics.id !== comicId));
    } catch (error) {
      console.error(error);
      alert("Failed to remove bookmark");
    }
  };

  const clearAllBookmarks = async () => {
    if (!confirm("Clear all bookmarks?")) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/bookmarks`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed");
      }

      setBookmarks([]);
    } catch (error) {
      console.error(error);
      alert("Failed to clear bookmarks");
    }
  };

  // Filter, Search, Sort
  const filteredBookmarks = bookmarks.filter((item) =>
    item.comics.title.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookmarks.length / PAGE_SIZE),
  );

  const paginatedBookmarks = filteredBookmarks.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            </Link>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Komify
              </p>
              <h1 className="text-sm font-semibold text-white">Bookmark</h1>
            </div>
          </div>

          {/* Center Controls */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookmarks..."
                className="w-64 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 pl-10 text-sm text-zinc-200 outline-none transition focus:border-indigo-500"
              />

              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                🔍
              </div>
            </div>

            {/* Type Filter */}
            <select className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300 outline-none transition focus:border-indigo-500">
              <option value="all">All Types</option>
              <option value="manga">Manga</option>
              <option value="manhwa">Manhwa</option>
            </select>

            {/* Sort */}
            <select className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300 outline-none transition focus:border-indigo-500">
              <option value="last_added">Last Added</option>
              <option value="old_added">Oldest Added</option>
            </select>
          </div>

          {/* Right */}
          <button
            onClick={clearAllBookmarks}
            className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-5">
        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {loading ? (
            <div className="col-span-full py-20 text-center text-zinc-500">
              Loading bookmarks...
            </div>
          ) : paginatedBookmarks.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <Bookmark className="mx-auto mb-4 h-12 w-12 text-zinc-700" />

              <p className="text-zinc-500">No bookmarks found</p>
            </div>
          ) : (
            paginatedBookmarks.map((item) => (
              <Link
                key={item.comics.id}
                href={`/comic/${item.comics.seo_slug ?? item.comics.id}`}
                className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 transition hover:border-indigo-500/40"
              >
                <div className="aspect-2/3 bg-zinc-900">
                  {item.comics.cover_path && (
                    <img
                      src={`${baseUrl}${item.comics.cover_path}`}
                      alt={item.comics.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white">
                    {item.comics.title}
                  </h3>

                  <p className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
                    <Clock3 className="h-3 w-3" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeBookmark(item.comics.id);
                    }}
                    className="rounded-xl bg-red-500/10 p-2 text-red-300 backdrop-blur-xl hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Link>
            ))
          )}
        </div>
        {/* Pagination */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-400 transition hover:border-indigo-500 hover:text-white disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-4 text-sm text-zinc-400">
            {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-400 transition hover:border-indigo-500 hover:text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
