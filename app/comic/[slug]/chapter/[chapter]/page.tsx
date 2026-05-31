"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Pencil,
} from "lucide-react";

type ChapterPage = {
  id: string;
  filename: string;
  filepath: string;
  page_number: number;
  width: number | null;
  height: number | null;
};

type ChapterDetail = {
  id: string;
  title: string;
  chapter_number: string;
  total_pages: number;
  published_at: string;
  pages: ChapterPage[];
};

async function getComicMetadata(id: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const response = await fetch(`${baseUrl}/comics/${id}/chapters`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chapters");
  }

  return response.json();
}

export default function ChapterReaderPage() {
  const params = useParams();

  const slug = params.slug as string;
  const chapterId = params.chapter as string;

  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);

        const response = await getComicMetadata(slug);

        const foundChapter = response.data.find(
          (item: ChapterDetail) => item.id === chapterId,
        );

        setChapter(foundChapter || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (slug && chapterId) {
      fetchChapter();
    }
  }, [slug, chapterId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-zinc-400">
        Loading chapter...
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-zinc-400">
        Chapter not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Reader Bar */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            {/* Back */}
            <Link
              href={`/comic/${slug}`}
              className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            </Link>

            {/* Title */}
            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-semibold text-white">
                {chapter.title}
              </p>

              <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                <span>Chapter {chapter.chapter_number}</span>

                <span className="h-1 w-1 rounded-full bg-zinc-700" />

                <span>Total Pages: {chapter.total_pages}</span>
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
              Chapter {chapter.chapter_number}
            </button>

            <button className="group flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400">
              <span>Next</span>

              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>
          {/* tambahkan tombol link ke halaman edit chapternya */}
          <Link
            href={`/comic/${slug}/chapter/${chapterId}/edit`}
            className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
          >
            <Pencil className="h-4 w-4" />
            Edit Chapter
          </Link>
        </div>
      </header>

      {/* Reader */}
      <main className="mx-auto flex max-w-5xl flex-col items-center px-4 py-6">
        {/* Reader Pages */}
        <div className="w-full space-y-4">
          {chapter.pages.map((page) => (
            <div
              key={page.id}
              className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 shadow-2xl"
            >
              <div className="relative">
                <Image
                  src={`${baseUrl}${page.filepath}`}
                  alt={`Page ${page.page_number}`}
                  width={1200}
                  height={1800}
                  className="h-auto w-full"
                  unoptimized
                />
              </div>

              {/* Hover Overlay */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-black/80 to-transparent px-5 py-4 opacity-0 transition duration-200 group-hover:opacity-100">
                <p className="text-sm font-medium text-white">
                  Page {page.page_number}
                </p>

                <p className="text-xs text-zinc-400">{page.filename}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button className="group flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-5 py-3 text-sm text-zinc-300 transition hover:border-indigo-500 hover:text-white">
            <ChevronLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            Prev Chapter
          </button>

          <Link
            href={`/comic/${slug}`}
            className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            <BookOpen className="h-4 w-4" />
            Chapter List
          </Link>

          <button className="group flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-400">
            Next Chapter
            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </main>
    </div>
  );
}
