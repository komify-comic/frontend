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

export default function HomePage() {
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
              {Array.from({ length: 10 }).map((_, index) => {
                const isCompleted = index % 2 === 0;

                const title =
                  "Very Long Comic Title That Will Automatically Clamp Into Two Lines Instead Of Breaking The Entire Layout";

                return (
                  <Link
                    key={index}
                    href="/comic/solo-leveling-ragnarok"
                    className="group block cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {/* Cover */}
                    <div className="relative aspect-2/3 overflow-hidden rounded-2xl bg-zinc-900 transition duration-300 group-hover:scale-[1.02]">
                      {/* Top Badges */}
                      <div className="absolute left-2 top-2 flex flex-wrap gap-2">
                        {/* NEW */}
                        <div className="rounded-lg bg-indigo-500 px-2 py-1 text-[10px] font-semibold text-white">
                          NEW
                        </div>

                        {/* Status */}
                        <div
                          className={`rounded-lg px-2 py-1 text-[10px] font-semibold text-white ${
                            isCompleted ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        >
                          {isCompleted ? "COMPLETE" : "ONGOING"}
                        </div>
                      </div>

                      {/* Bottom Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-3">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-white">
                              120 Chapters
                            </p>

                            <p className="mt-1 text-[10px] text-zinc-300">
                              Updated 2h ago
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
                          {title}
                        </h3>

                        {/* Hover Tooltip */}
                        <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-max max-w-65 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs leading-5 text-white opacity-0 shadow-2xl transition duration-200 group-hover:opacity-100">
                          {title}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex items-center justify-center gap-2">
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
          </div>
        </div>
      </section>
    </main>
  );
}
