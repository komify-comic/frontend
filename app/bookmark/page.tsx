import Link from "next/link";
import { ArrowLeft, Bookmark, Clock3, Trash2 } from "lucide-react";

export default function BookmarkPage() {
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
          <button className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20">
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-5">
        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 transition hover:border-indigo-500/40"
            >
              {/* Cover */}
              <div className="aspect-2/3 bg-zinc-900" />

              {/* Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4">
                <h3 className="line-clamp-2 text-sm font-semibold text-white">
                  Comic Title Very Long Example That Will Be Clamped
                </h3>

                <p className="mt-1 text-xs text-zinc-400">
                  Chapter 120 • 2h ago
                </p>
              </div>

              {/* Actions */}
              <div className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
                <button className="rounded-xl bg-red-500/10 p-2 text-red-300 backdrop-blur-xl hover:bg-red-500/20">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {/* Prev */}
          <button className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-400 transition hover:border-indigo-500 hover:text-white disabled:opacity-40">
            Prev
          </button>

          {/* Pages */}
          <button className="h-10 w-10 rounded-xl bg-indigo-500 text-sm font-semibold text-white">
            1
          </button>

          <button className="h-10 w-10 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-400 transition hover:border-indigo-500 hover:text-white">
            2
          </button>

          <button className="h-10 w-10 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-400 transition hover:border-indigo-500 hover:text-white">
            3
          </button>

          {/* Ellipsis */}
          <span className="px-2 text-zinc-500">...</span>

          <button className="h-10 w-10 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-400 transition hover:border-indigo-500 hover:text-white">
            10
          </button>

          {/* Next */}
          <button className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-400 transition hover:border-indigo-500 hover:text-white">
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
