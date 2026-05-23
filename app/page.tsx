"use client";

import {
  Bookmark,
  Upload,
  Settings,
  Search,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Comic = {
  id: string;
  title: string;

  seo_slug: string | null;

  legacy_id: number;

  cover_path: string | null;

  published_at: string;

  total_chapters: number;

  rating_score: number;

  rating_count: number;

  status: {
    id: string;
    name: string;
  };
};

type HomepageResponse = {
  data: Comic[];
  pagination: {
    page: number;
    limit: number;
    has_next: boolean;
    has_prev: boolean;
    total_data: number;
    total_pages: number;
  };
};

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [comics, setComics] = useState<Comic[]>([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    has_next: false,
    has_prev: false,
    total_data: 0,
    total_pages: 1,
  });

  /* ================= FETCH ================= */
  const fetchHomepage = async (targetPage: number) => {
    try {
      setLoading(true);

      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

      const endpoint =
        targetPage === 1
          ? `${baseUrl}/comics/homepage`
          : `${baseUrl}/comics/homepage?page=${targetPage}&limit=10`;

      const response = await fetch(endpoint, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch homepage");
      }

      const result: HomepageResponse = await response.json();

      setComics(result.data || []);

      setPagination(
        result.pagination || {
          page: 1,
          limit: 10,
          has_next: false,
          has_prev: false,
          total_data: 0,
          total_pages: 1,
        },
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepage(page);
  }, [page]);

  /* ================= PAGINATION ================= */
  const visiblePages = useMemo(() => {
    const total = pagination.total_pages;

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (page >= total - 2) {
      return [total - 4, total - 3, total - 2, total - 1, total];
    }

    return [page - 2, page - 1, page, page + 1, page + 2];
  }, [page, pagination.total_pages]);

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-337.5 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500">
              <BookOpenText className="h-5 w-5 text-white" />
            </div>

            <span className="text-lg font-bold tracking-tight">Komify</span>
          </div>

          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

              <input
                type="text"
                placeholder="Search comics..."
                className="w-100 rounded-xl border border-zinc-800 bg-zinc-900 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/bookmark"
              className="group flex items-center gap-2 rounded-2xl px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <Bookmark className="h-4 w-4 transition group-hover:scale-110" />
              <span>Bookmark</span>
            </Link>

            <Link
              href="/upload"
              className="group flex items-center gap-2 rounded-2xl px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              <Upload className="h-4 w-4 transition group-hover:scale-110" />
              <span>Upload</span>
            </Link>

            <Link
              href="/settings"
              className="group flex items-center gap-2 rounded-2xl px-4 py-2 text-sm text-zinc-400 transition hover:bg-indigo-500/10 hover:text-indigo-300"
            >
              <Settings className="h-4 w-4 transition group-hover:scale-110" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Latest Updates */}
      <section className="mx-auto max-w-337.5 px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Sidebar Filter */}
          <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 lg:sticky lg:top-24">
            {/* Header */}
            <div className="mb-6 flex items-center gap-2">
              <Filter className="h-5 w-5 text-indigo-400" />

              <h3 className="font-semibold">Filters</h3>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium text-zinc-300">
                Categories
              </h4>

              <div className="flex flex-wrap gap-2">
                {["Manga", "Manhwa", "Manhua"].map((item, index) => (
                  <button
                    key={item}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                      index === 0
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-indigo-500 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium text-zinc-300">Tags</h4>

              <div className="flex flex-wrap gap-2">
                {[
                  "Adventure",
                  "Fantasy",
                  "Action",
                  "Strategy",
                  "Drama",
                  "Romance",
                  "Comedy",
                  "Sci-Fi",
                ].map((tag, index) => (
                  <button
                    key={tag}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                      index === 1 || index === 2
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-indigo-500 hover:text-white"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium text-zinc-300">
                Language
              </h4>

              <div className="flex flex-wrap gap-2">
                {["English", "Japanese", "Indonesian"].map((lang, index) => (
                  <button
                    key={lang}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                      index === 0
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-indigo-500 hover:text-white"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium text-zinc-300">Status</h4>

              <div className="flex flex-wrap gap-2">
                {["Ongoing", "Completed", "Hiatus"].map((status) => (
                  <button
                    key={status}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-indigo-500 hover:text-white"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium text-zinc-300">
                Sort By
              </h4>

              <div className="flex flex-wrap gap-2">
                {["Latest", "Newest", "Popular", "A-Z"].map((sort, index) => (
                  <button
                    key={sort}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                      index === 0
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-indigo-500 hover:text-white"
                    }`}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">
                Apply
              </button>

              <button className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800">
                Reset
              </button>
            </div>
          </aside>

          {/* Comic Grid */}
          <div>
            {/* Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
              {loading
                ? Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/40 p-2"
                    >
                      <div className="aspect-2/3 rounded-2xl bg-zinc-800" />

                      <div className="mt-3 h-4 rounded bg-zinc-800" />

                      <div className="mt-2 h-4 w-2/3 rounded bg-zinc-800" />
                    </div>
                  ))
                : comics.map((comic) => {
                    const isCompleted =
                      comic.status?.name?.toLowerCase() === "complete";

                    return (
                      <Link
                        key={comic.id}
                        href={`/comic/${comic.id || comic.legacy_id}`}
                        className="group block cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {/* Cover */}
                        <div className="relative aspect-2/3 overflow-hidden rounded-2xl bg-zinc-900 transition duration-300 group-hover:scale-[1.02]">
                          {/* Cover Image */}
                          {comic.cover_path ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${comic.cover_path}`}
                              alt={comic.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-zinc-800" />
                          )}

                          {/* Top Badges */}
                          <div className="absolute left-2 top-2 flex flex-wrap gap-2">
                            {/* NEW */}
                            {/* {comic.isNew && (
                              <div className="rounded-lg bg-indigo-500 px-2 py-1 text-[10px] font-semibold text-white">
                                NEW
                              </div>
                            )} */}

                            {/* Status */}
                            <div
                              className={`rounded-lg px-2 py-1 text-[10px] font-semibold text-white ${
                                isCompleted ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            >
                              {comic.status?.name}
                            </div>
                          </div>

                          {/* Bottom Overlay */}
                          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-3">
                            <div className="flex items-end justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold text-white">
                                  {comic.total_chapters} Chapters
                                </p>

                                <p className="mt-1 text-[10px] text-zinc-300">
                                  Updated{" "}
                                  {new Date(
                                    comic.published_at,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="mt-3">
                          <div className="relative">
                            {/* Title */}
                            <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-zinc-100 transition group-hover:text-white">
                              {comic.title}
                            </h3>

                            {/* Hover Tooltip */}
                            <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-max max-w-65 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs leading-5 text-white opacity-0 shadow-2xl transition duration-200 group-hover:opacity-100">
                              {comic.title}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
            </div>

            {/* Empty */}
            {!loading && comics.length === 0 && (
              <div className="flex h-80 items-center justify-center">
                <p className="text-sm text-zinc-500">No comics available.</p>
              </div>
            )}

            {/* Pagination */}
            {pagination.total_data > 10 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {/* Prev */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-400 transition hover:border-indigo-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>

                {/* First Page */}
                {!visiblePages.includes(1) && (
                  <>
                    <button
                      onClick={() => setPage(1)}
                      className="h-10 w-10 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-400 transition hover:border-indigo-500 hover:text-white"
                    >
                      1
                    </button>

                    <span className="px-1 text-zinc-500">...</span>
                  </>
                )}

                {/* Pages */}
                {visiblePages.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-10 min-w-10 rounded-xl px-4 text-sm font-semibold transition ${
                      page === p
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-indigo-500 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                {/* Last Page */}
                {!visiblePages.includes(pagination.total_pages) &&
                  pagination.total_pages > 1 && (
                    <>
                      <span className="px-1 text-zinc-500">...</span>

                      <button
                        onClick={() => setPage(pagination.total_pages)}
                        className="h-10 w-10 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-400 transition hover:border-indigo-500 hover:text-white"
                      >
                        {pagination.total_pages}
                      </button>
                    </>
                  )}

                {/* Next */}
                <button
                  disabled={!pagination.has_next}
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(prev + 1, pagination.total_pages),
                    )
                  }
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-400 transition hover:border-indigo-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
