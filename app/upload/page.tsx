import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  BookOpen,
  Plus,
  FilePlus,
} from "lucide-react";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Bar (Back Only) */}
      <div className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left - Back + Comic ID */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300 transition hover:border-indigo-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            Back
          </Link>
        </div>

        {/* Center - Template Selector */}
        <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-1">
          {[
            { key: "doujinshi", label: "Doujinshi" },
            { key: "manga", label: "Manga" },
            { key: "manhwa", label: "Manhwa" },
          ].map((item, index) => {
            const isActive = index === 0;

            return (
              <button
                key={item.key}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right - Publish */}
        <button className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400">
          <Upload className="h-4 w-4" />
          Publish Comic
        </button>
      </div>

      {/* Content */}
      <main className="mx-auto grid max-w-500 grid-cols-1 gap-6 px-6 pb-10 lg:grid-cols-[1fr_2fr_2fr]">
        {/* ================= LEFT: COVER ================= */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <ImageIcon className="h-4 w-4 text-indigo-400" />
            Cover
          </h2>

          <div className="group relative aspect-2/3 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              Upload Cover Image
            </div>

            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
          </div>

          <button className="mt-4 w-full rounded-2xl bg-indigo-500/10 px-4 py-3 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/20 hover:text-indigo-200">
            Change Cover
          </button>
        </section>

        {/* ================= MIDDLE: METADATA ================= */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              Metadata
            </h2>

            {/* Comic ID badge */}
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-indigo-400" />
              <span className="text-xs font-bold text-white">#1</span>
            </div>
          </div>

          <div className="space-y-5">
            {[
              { label: "Title", placeholder: "Comic Title" },
              { label: "Parodies", placeholder: "Solo Leveling, Naruto" },
              {
                label: "Characters",
                placeholder: "Sung Jin-Woo, Naruto Uzumaki",
              },
              { label: "Artists", placeholder: "Redice Studio" },
              { label: "Authors", placeholder: "Chugong" },
              { label: "Groups", placeholder: "Scanlation Team" },
              { label: "Tags", placeholder: "Action, Fantasy, Adventure" },
            ].map((field) => (
              <div key={field.label}>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  {field.label}
                </label>

                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 outline-none transition focus:border-indigo-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ================= RIGHT: CHAPTERS ================= */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <FilePlus className="h-4 w-4 text-indigo-400" />
              Chapters
            </h2>

            <button className="text-xs text-zinc-400 hover:text-indigo-400">
              Manage
            </button>
          </div>

          <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">
            <Plus className="h-4 w-4" />
            Add Chapter
          </button>

          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="group flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 transition hover:border-indigo-500/40"
              >
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-indigo-300">
                    Chapter {i + 1}
                  </p>
                  <p className="text-xs text-zinc-500">0 pages</p>
                </div>

                <button className="text-xs text-indigo-400 opacity-0 transition group-hover:opacity-100">
                  Edit
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
