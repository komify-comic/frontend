import {
  Star,
  Clock3,
  BookmarkPlus,
  Pencil,
  Trash2,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function ComicDetailPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="relative min-h-screen overflow-hidden bg-zinc-950">
        {/* Background */}
        <div className="absolute inset-0 bg-zinc-950" />

        {/* Glow Effects */}
        <div className="absolute left-1/2 top-0 h-175 w-175 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-100 w-100 rounded-full bg-fuchsia-500/5 blur-3xl" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-zinc-950/60 to-zinc-950" />

        {/* Header */}
        <header className="sticky top-0 z-50">
          <div className="flex h-18 items-center justify-between px-6">
            {/* Left */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
              </Link>
              {/* Text */}
              <div className="leading-tight">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500 transition group-hover:text-indigo-300">
                  Komify
                </p>

                <p className="text-sm font-semibold text-white">
                  Back to Library
                </p>
              </div>
            </div>

            {/* Right */}
            <nav className="hidden items-center gap-2 lg:flex">
              {/* Rating */}
              <div className="flex items-center gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3">
                <span className="text-sm font-medium text-yellow-200">
                  Rating
                </span>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <button
                      key={index}
                      className="group transition hover:scale-110"
                    >
                      <Star
                        className={`h-5 w-5 transition ${
                          index < 4
                            ? "fill-yellow-300 text-yellow-300"
                            : "text-yellow-500/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <span className="text-xs font-medium text-yellow-300/80">
                  4.0
                </span>
              </div>

              {/* Bookmark */}
              <button className="group flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white">
                <BookmarkPlus className="h-4 w-4 transition group-hover:scale-110" />

                <span>Add Bookmark</span>
              </button>

              {/* Edit */}
              <button className="group flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 transition hover:border-amber-500 hover:bg-amber-500/10 hover:text-white">
                <Pencil className="h-4 w-4 transition group-hover:scale-110" />

                <span>Edit Comic</span>
              </button>

              {/* Delete */}
              <button className="group flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 transition hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-200">
                <Trash2 className="h-4 w-4 transition group-hover:scale-110" />

                <span>Delete Comic</span>
              </button>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="relative flex min-h-screen items-center px-6 py-6">
          <div className="grid w-full items-center gap-8 xl:grid-cols-[300px_1fr]">
            {/* Cover */}
            <div className="mx-auto w-full max-w-75">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 scale-95 rounded-4xl bg-indigo-500/20 blur-2xl" />

                {/* Cover */}
                <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-zinc-900 shadow-2xl">
                  <div className="aspect-2/3 w-full bg-zinc-800" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              {/* Status */}
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {/* Comic ID */}
                <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-indigo-400" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    ID
                  </span>

                  <span className="text-xs font-bold text-white">#000001</span>
                </div>

                {/* New Badge */}
                <span className="rounded-2xl bg-indigo-500 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-indigo-500/20">
                  New
                </span>

                {/* Status */}
                <span className="rounded-2xl bg-emerald-500 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/20">
                  Completed
                </span>

                {/* Type */}
                <span className="rounded-2xl border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                  Manga
                </span>
              </div>

              {/* Title */}
              <div className="group relative max-w-5xl">
                <h1 className="line-clamp-2 min-h-20 text-4xl font-black tracking-tight text-white lg:min-h-30 lg:text-6xl lg:leading-[0.95]">
                  Solo Leveling Ragnarok Side Story, and More Alternative Title
                  Here, and More Alternative Title Here, and More Alternative
                  Title Here
                </h1>

                {/* Full Title Tooltip */}
                <div className="pointer-events-none absolute left-0 top-full z-30 mt-4 w-max max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900/95 px-5 py-4 opacity-0 shadow-2xl backdrop-blur-xl transition duration-200 group-hover:opacity-100">
                  <p className="text-sm leading-7 text-white">
                    Solo Leveling Ragnarok Side Story, and More Alternative
                    Title Here, and More Alternative Title Here, and More
                    Alternative Title Here
                  </p>
                </div>
              </div>

              {/* Alternative */}
              <p className="mt-3 max-w-4xl text-sm text-zinc-500">
                Alternative Title Name Here • Japanese Name Here • Korean Name
                Here
              </p>

              {/* Metadata */}
              <div className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
                {[
                  {
                    label: "Parodies",
                    values: ["Sword Art Online", "Overlord"],
                  },
                  {
                    label: "Characters",
                    values: ["Asuna", "Ainz Ooal Gown"],
                  },
                  {
                    label: "Authors",
                    values: ["Tatsuki Fujimoto", "Gege Akutami"],
                  },
                  {
                    label: "Artists",
                    values: ["Kishayama", "Redice Studio"],
                  },
                  {
                    label: "Groups",
                    values: ["Circle-Red", "Studio-B"],
                  },
                  {
                    label: "Tags",
                    values: [
                      "Action",
                      "Fantasy",
                      "Adventure",
                      "Strategy",
                      "Magic",
                    ],
                  },
                ].map((item, index, array) => (
                  <div
                    key={item.label}
                    className={`grid gap-4 px-5 py-4 lg:grid-cols-[100px_1fr] ${
                      index !== array.length - 1
                        ? "border-b border-zinc-800"
                        : ""
                    }`}
                  >
                    {/* Label Column */}
                    <div className="pt-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                        {item.label}
                      </p>
                    </div>

                    {/* Value Column */}
                    <div className="flex flex-wrap gap-2">
                      {item.values.map((value) => (
                        <button
                          key={value}
                          className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Meta */}
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    icon: <Clock3 className="h-4 w-4 text-indigo-400" />,
                    label: "Created 2h ago",
                  },
                  {
                    icon: <Clock3 className="h-4 w-4 text-indigo-400" />,
                    label: "Updated 2h ago",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/3 px-4 py-3 backdrop-blur-xl"
                  >
                    {item.icon}

                    <span className="text-sm text-zinc-300">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Synopsis */}
              <div className="mt-5 max-w-5xl">
                <h2 className="mb-3 text-lg font-bold text-white">Synopsis</h2>

                <p className="line-clamp-4 text-sm leading-7 text-zinc-400">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Temporibus facere, nihil porro doloremque impedit
                  exercitationem pariatur at ipsum accusantium illum inventore
                  quaerat provident laboriosam voluptatem architecto eveniet
                  natus.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Chapter Section */}
      <section className="flex min-h-screen flex-col px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Chapters
            </h2>

            <p className="mt-1 text-sm text-zinc-500">8 chapters available</p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search chapter..."
              className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-200 outline-none transition focus:border-indigo-500"
            />

            {/* Sort */}
            <button className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white">
              Latest First
            </button>
          </div>
        </div>

        {/* Chapter List */}
        <div className="flex-1 space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="group flex items-center justify-between rounded-3xl border border-zinc-800 bg-zinc-900/40 px-5 py-4 backdrop-blur-sm transition hover:border-indigo-500/40 hover:bg-zinc-900/80"
            >
              {/* Left */}
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  {/* Chapter Number */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-800 text-sm font-bold text-zinc-200 transition group-hover:bg-indigo-500">
                    {8 - index}
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">
                      The Awakening
                    </h3>

                    <p className="mt-1 text-xs text-zinc-500">
                      Released 2 days ago
                    </p>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                {/* Read Progress */}
                <span className="hidden rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[11px] font-medium text-emerald-300 sm:block">
                  Read
                </span>

                {/* Action */}
                <Link
                  href="/comic/solo-leveling/chapter/120"
                  className="group flex items-center gap-2 rounded-2xl bg-zinc-800 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-indigo-500 hover:text-white"
                >
                  <BookOpen className="h-4 w-4 transition group-hover:scale-110" />

                  <span>Read Chapter</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {/* Prev */}
          <button className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-300 transition hover:border-indigo-500 hover:text-white">
            Previous
          </button>

          {/* Pages */}
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`h-11 min-w-11 rounded-2xl px-4 text-sm font-semibold transition ${
                page === 1
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-indigo-500 hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-300 transition hover:border-indigo-500 hover:text-white">
            Next
          </button>
        </div>
      </section>
    </main>
  );
}
