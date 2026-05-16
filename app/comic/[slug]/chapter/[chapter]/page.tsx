import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  List,
  Maximize2,
  Moon,
  Settings2,
} from "lucide-react";

export default function ChapterReaderPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Reader Bar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            {/* Back */}
            <Link
              href="/comic/solo-leveling"
              className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            </Link>

            {/* Title */}
            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-semibold text-white">
                Solo Leveling Ragnarok Side Story With Very Long Title Here
              </p>

              <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                <span>Chapter 120</span>

                <span className="h-1 w-1 rounded-full bg-zinc-700" />

                <span>Total Pages: 38</span>
              </div>
            </div>
          </div>

          {/* Center Navigation */}
          <div className="hidden items-center gap-2 lg:flex">
            <button className="group flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-300 transition hover:border-indigo-500 hover:text-white">
              <ChevronLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />

              <span>Prev</span>
            </button>

            <button className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-5 py-2 text-sm font-medium text-zinc-300 transition hover:border-indigo-500 hover:text-white">
              Chapter 120
            </button>

            <button className="group flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400">
              <span>Next</span>

              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Reader */}
      <main className="mx-auto flex max-w-5xl flex-col items-center px-4 py-6">
        {/* Reader Pages */}
        <div className="w-full space-y-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 shadow-2xl"
            >
              {/* Fake Manga Page */}
              <div className="aspect-[0.72] w-full bg-zinc-900" />

              {/* Hover Overlay */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-black/80 to-transparent px-5 py-4 opacity-0 transition duration-200 group-hover:opacity-100">
                <p className="text-sm font-medium text-white">
                  Page {index + 1}
                </p>

                <p className="text-xs text-zinc-400">Click to zoom</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
