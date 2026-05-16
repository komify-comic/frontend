"use client";

import { useState } from "react";
import { v7 as uuidv7 } from "uuid";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  BookOpen,
  Plus,
  FilePlus,
  Trash2,
} from "lucide-react";

type Chapter = {
  id: string;
  main: number;
  sub: number;
  title: string;
  language: string;
};

export default function UploadPage() {
  // CHAPTER STATE MANAGEMENT
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: uuidv7(), main: 1, sub: 0, title: "", language: "en" },
    { id: uuidv7(), main: 2, sub: 0, title: "", language: "en" },
    { id: uuidv7(), main: 3, sub: 0, title: "", language: "en" },
  ]);
  const getSortedList = (list: Chapter[]) => {
    return [...list].sort((a, b) => {
      if (a.main !== b.main) return a.main - b.main;
      return a.sub - b.sub;
    });
  };
  const addChapter = () => {
    setChapters((prev) => {
      const sortedPrev = getSortedList(prev);
      const lastMain =
        sortedPrev.length > 0 ? sortedPrev[sortedPrev.length - 1].main : 0;

      return [
        ...prev,
        {
          id: uuidv7(),
          main: lastMain + 1,
          sub: 0,
          title: "",
          language: "en",
        },
      ];
    });
  };
  const removeChapter = (id: string) => {
    setChapters((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      const sorted = getSortedList(filtered);
      return sorted.map((chapter, index) => ({
        ...chapter,
        main: index + 1,
      }));
    });
  };

  const updateChapter = (
    id: string,
    field: keyof Chapter,
    value: string | number,
  ) => {
    setChapters((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              [field]: value,
            }
          : c,
      ),
    );
  };
  const sortedChapters = [...chapters].sort((a, b) => {
    if (a.main !== b.main) {
      return a.main - b.main;
    }
    return a.sub - b.sub;
  });

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
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 h-fit">
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
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 h-fit">
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
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 h-fit">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            {/* Left */}
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <FilePlus className="h-4 w-4 text-indigo-400" />
              Chapters
            </h2>

            {/* Right - Add Chapter */}
            <button
              onClick={addChapter}
              className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              <Plus className="h-4 w-4" />
              Add Chapter
            </button>
          </div>

          {/* Chapter Items */}
          <div className="space-y-4">
            {sortedChapters.map((chapter) => (
              <div
                key={chapter.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition hover:border-indigo-500/40"
              >
                {/* Header Row */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">Chapter</span>

                    {/* Chapter Number (1.2 style) */}
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={chapter.main}
                        onChange={(e) =>
                          updateChapter(
                            chapter.id,
                            "main",
                            Number(e.target.value),
                          )
                        }
                        className="w-14 rounded-xl border border-zinc-800 bg-zinc-900 px-2 py-2 text-center text-sm font-semibold text-indigo-300 outline-none focus:border-indigo-500"
                      />

                      <span className="text-zinc-500">.</span>

                      <input
                        type="number"
                        value={chapter.sub}
                        onChange={(e) =>
                          updateChapter(
                            chapter.id,
                            "sub",
                            Number(e.target.value),
                          )
                        }
                        className="w-14 rounded-xl border border-zinc-800 bg-zinc-900 px-2 py-2 text-center text-sm font-semibold text-indigo-300 outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 text-xs">
                    <button className="text-zinc-400 transition hover:text-indigo-400">
                      Preview
                    </button>

                    <span className="text-zinc-700">•</span>

                    <button
                      onClick={() => removeChapter(chapter.id)}
                      className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid gap-3 md:grid-cols-5">
                  {/* Title */}
                  <input
                    type="text"
                    placeholder="Chapter Title"
                    value={chapter.title}
                    onChange={(e) =>
                      updateChapter(chapter.id, "title", e.target.value)
                    }
                    className="md:col-span-3 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-indigo-500"
                  />

                  {/* Language */}
                  <select
                    value={chapter.language}
                    onChange={(e) =>
                      updateChapter(chapter.id, "language", e.target.value)
                    }
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-indigo-500"
                  >
                    <option value="en">English</option>
                    <option value="jp">Japanese</option>
                    <option value="kr">Korean</option>
                    <option value="id">Indonesian</option>
                  </select>

                  {/* Upload */}
                  <label className="md:col-span-5 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-zinc-700 bg-zinc-900 px-3 py-8 text-sm text-zinc-400 transition hover:border-indigo-500 hover:text-indigo-300">
                    <span className="font-medium">Upload Pages</span>
                    <span className="text-xs text-zinc-600">
                      JPG / PNG / ZIP • Drag & Drop supported
                    </span>

                    <input type="file" className="hidden" multiple />
                  </label>
                </div>

                {/* Footer Info */}
                <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                  <span>0 files uploaded</span>

                  <span className="text-zinc-600">auto saved draft</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
