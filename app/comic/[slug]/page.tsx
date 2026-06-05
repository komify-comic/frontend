"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Star,
  Clock3,
  BookmarkPlus,
  Pencil,
  Trash2,
  ArrowLeft,
  ImageIcon,
  BookOpen,
  Plus,
  GripVertical,
} from "lucide-react";

type ComicMetadata = {
  id: string;
  title: string;
  alternative_title: string | null;
  description: string | null;
  legacy_id: number;
  cover_path: string | null;
  total_chapters: number;

  status: {
    id: string;
    name: string;
  };

  category: {
    id: string;
    name: string;
    slug: string;
  };

  tags: {
    id: string;
    name: string;
    slug: string;
  }[];

  parodies: {
    id: string;
    name: string;
    slug: string;
  }[];

  characters: {
    id: string;
    name: string;
    slug: string;
  }[];

  artists: {
    id: string;
    name: string;
    slug: string;
  }[];

  authors: {
    id: string;
    name: string;
    slug: string;
  }[];

  groups: {
    id: string;
    name: string;
    slug: string;
  }[];

  created_at: string;
  updated_at: string;
};

type ComicChapter = {
  id: string;
  title: string;
  chapter_number: string;
  total_pages: number;
  published_at: string;

  language: {
    code: string;
    name: string;
  };

  censorship: {
    id: string;
    name: string;
  };

  pages: {
    id: string;
    filename: string;
    filepath: string;
    page_number: number;
  }[];
};

type ComicChaptersResponse = {
  data: ComicChapter[];
  comic_id: string;
  total_chapters: number;
};

async function getComicMetadata(id: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const response = await fetch(`${baseUrl}/comics/${id}/metadata`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch comic metadata");
  }

  return response.json();
}

export default function ComicDetailPage() {
  const router = useRouter();
  const params = useParams();

  const slug = params.slug as string;
  const [comic, setComic] = useState<ComicMetadata | null>(null);
  const [loadingComic, setLoadingComic] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOrderingMode, setIsOrderingMode] = useState(false);
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const coverUrl = comic?.cover_path ? `${baseUrl}${comic.cover_path}` : null;

  useEffect(() => {
    const fetchComic = async () => {
      try {
        setLoadingComic(true);

        const data = await getComicMetadata(slug);
        setComic(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingComic(false);
      }
    };

    if (slug) {
      fetchComic();
    }
  }, [slug]);

  // Chapters State
  const [chapters, setChapters] = useState<ComicChapter[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(true);
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoadingChapters(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
        const response = await fetch(`${baseUrl}/comics/${slug}/chapters`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chapters");
        }

        const result: ComicChaptersResponse = await response.json();
        setChapters(result.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingChapters(false);
      }
    };

    if (slug) {
      fetchChapters();
    }
  }, [slug]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setChapters((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // Thumbnail Modal State
  const [selectedChapter, setSelectedChapter] = useState<ComicChapter | null>(
    null,
  );
  useEffect(() => {
    if (selectedChapter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedChapter]);

  const CHAPTERS_PER_PAGE = 7;
  const totalPages = Math.ceil(chapters.length / CHAPTERS_PER_PAGE);
  const paginatedChapters = chapters.slice(
    (currentPage - 1) * CHAPTERS_PER_PAGE,
    currentPage * CHAPTERS_PER_PAGE,
  );
  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(chapters.length / CHAPTERS_PER_PAGE),
    );
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [chapters, currentPage]);

  const [deletingComic, setDeletingComic] = useState(false);
  const handleDeleteComic = async () => {
    if (!comic) return;
    const confirmed = window.confirm(
      `Delete comic "${comic.title}"?\n\nThis will permanently delete:\n- Comic metadata\n- All chapters\n- All pages\n- All images`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingComic(true);

      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const response = await fetch(`${baseUrl}/comics/${comic.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to delete comic");
      }
      alert(
        `Comic deleted successfully.\n\nDeleted chapters: ${result.deleted_chapters}\nDeleted pages: ${result.deleted_pages}`,
      );

      router.push("/");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to delete comic");
    } finally {
      setDeletingComic(false);
    }
  };

  if (loadingComic || !comic) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-sm text-zinc-500">Loading comic...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
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
              {/* Edit */}
              <Link
                href={`/comic/${comic.id}/edit`}
                className="group flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 transition hover:border-amber-500 hover:bg-amber-500/10 hover:text-white"
              >
                <Pencil className="h-4 w-4 transition group-hover:scale-110" />
                <span>Edit Comic</span>
              </Link>

              {/* Delete */}
              <button
                onClick={handleDeleteComic}
                disabled={deletingComic}
                className={`group flex items-center gap-2 rounded-2xl px-4 py-3 text-sm transition ${
                  deletingComic
                    ? "cursor-not-allowed border border-zinc-800 bg-zinc-900 text-zinc-500"
                    : "border border-red-500/20 bg-red-500/10 text-red-300 hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-200"
                }`}
              >
                <Trash2
                  className={`h-4 w-4 ${
                    deletingComic ? "" : "transition group-hover:scale-110"
                  }`}
                />
                <span>{deletingComic ? "Deleting..." : "Delete Comic"}</span>
              </button>
            </nav>
          </div>
        </header>

        {/* Metadata */}
        <section
          className="relative flex min-h-screen items-center px-6 py-6"
          id="metadata"
        >
          <div className="grid w-full items-center gap-8 xl:grid-cols-[300px_1fr]">
            {/* Cover */}
            <div className="mx-auto w-full max-w-75">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 scale-95 rounded-4xl bg-indigo-500/20 blur-2xl" />

                {/* Cover */}
                <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-zinc-900 shadow-2xl">
                  <div className="relative aspect-2/3 w-full overflow-hidden bg-zinc-800">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={comic.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full bg-zinc-800" />
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 space-y-3">
                <Link
                  href="#"
                  className="group flex w-full items-center justify-center gap-2 rounded-3xl bg-indigo-500 px-5 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 transition hover:scale-[1.02] hover:bg-indigo-400"
                >
                  <BookOpen className="h-4 w-4 transition group-hover:scale-110" />

                  <span>Read First Chapter</span>
                </Link>

                <button className="flex w-full items-center justify-center gap-2 rounded-3xl border border-zinc-800 bg-zinc-900/80 px-5 py-4 text-sm font-semibold text-zinc-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white">
                  <BookmarkPlus className="h-4 w-4" />

                  <span>Add Bookmark</span>
                </button>

                {/* Rating */}
                <div className="rounded-3xl border border-yellow-500/10 bg-yellow-500/5 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <button
                        key={index}
                        className="group transition hover:scale-115"
                      >
                        <Star
                          className={`h-7 w-7 transition ${
                            index < 4
                              ? "fill-yellow-300 text-yellow-300"
                              : "text-yellow-500/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <p className="mt-3 text-center text-[11px] text-zinc-500">
                    Tap a star to rate this comic
                  </p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              {/* Status */}
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {/* ID */}
                <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-indigo-400" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    ID
                  </span>

                  <span className="text-xs font-bold text-white">
                    #{comic.legacy_id}
                  </span>
                </div>

                {/* Status */}
                <span className="rounded-2xl bg-emerald-500 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/20">
                  {comic.status.name}
                </span>

                {/* Type */}
                <span className="rounded-2xl border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                  {comic.category.name}
                </span>
              </div>

              {/* Title */}
              <div className="group relative max-w-5xl">
                <h1 className="line-clamp-2 min-h-20 text-4xl font-black tracking-tight text-white lg:min-h-30 lg:text-6xl lg:leading-[0.95]">
                  {comic.title}
                </h1>

                {/* Tooltip */}
                <div className="pointer-events-none absolute left-0 top-full z-30 mt-4 w-max max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900/95 px-5 py-4 opacity-0 shadow-2xl backdrop-blur-xl transition duration-200 group-hover:opacity-100">
                  <p className="text-sm leading-7 text-white">{comic.title}</p>
                </div>
              </div>

              {/* Alternative */}
              {comic.alternative_title && (
                <p className="mt-3 max-w-4xl text-sm text-zinc-500">
                  {comic.alternative_title}
                </p>
              )}

              {/* Metadata */}
              <div className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
                {[
                  {
                    label: "Parodies",
                    values: comic.parodies,
                  },
                  {
                    label: "Characters",
                    values: comic.characters,
                  },
                  {
                    label: "Authors",
                    values: comic.authors,
                  },
                  {
                    label: "Artists",
                    values: comic.artists,
                  },
                  {
                    label: "Groups",
                    values: comic.groups,
                  },
                  {
                    label: "Tags",
                    values: comic.tags,
                  },
                ]
                  .filter((item) => item.values.length > 0)
                  .map((item, index, array) => (
                    <div
                      key={item.label}
                      className={`grid gap-4 px-5 py-4 lg:grid-cols-[100px_1fr] ${
                        index !== array.length - 1
                          ? "border-b border-zinc-800"
                          : ""
                      }`}
                    >
                      {/* Label */}
                      <div className="pt-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                          {item.label}
                        </p>
                      </div>

                      {/* Values */}
                      <div className="flex flex-wrap gap-2">
                        {item.values.map((value) => (
                          <button
                            key={value.id}
                            className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
                          >
                            {value.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Quick Meta */}
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/3 px-4 py-3 backdrop-blur-xl">
                  <Clock3 className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm text-zinc-300">
                    Created{" "}
                    {comic.created_at
                      ? new Date(comic.created_at).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/3 px-4 py-3 backdrop-blur-xl">
                  <Clock3 className="h-4 w-4 text-indigo-400" />

                  <span className="text-sm text-zinc-300">
                    Updated {new Date(comic.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Synopsis */}
              {comic.description && (
                <div className="mt-5 max-w-5xl">
                  <h2 className="mb-3 text-lg font-bold text-white">
                    Synopsis
                  </h2>

                  <p className="text-sm leading-7 text-zinc-400">
                    {comic.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Chapter Section */}
      <section className="flex min-h-screen flex-col px-6 py-8" id="chapters">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Chapters
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {chapters.length} chapters available
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            {/* Add Chapter */}
            <Link
              href={`/comic/${comic.id}/chapter/create`}
              className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              <Plus className="h-4 w-4" />
              Add Chapter
            </Link>

            {/* Edit Ordering */}
            <button
              onClick={() => setIsOrderingMode((prev) => !prev)}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                isOrderingMode
                  ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:text-white"
                  : "border border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-white"
              }`}
            >
              <GripVertical className="h-4 w-4" />

              {isOrderingMode ? "Save Ordering" : "Edit Ordering"}
            </button>

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapters.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex-1 space-y-3">
              {loadingChapters ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5"
                  >
                    <div className="h-5 w-40 rounded bg-zinc-800" />

                    <div className="mt-3 h-4 w-24 rounded bg-zinc-800" />
                  </div>
                ))
              ) : chapters.length === 0 ? (
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-sm text-zinc-500">
                  No chapters available
                </div>
              ) : (
                paginatedChapters.map((chapter) => (
                  <SortableChapterCard
                    key={chapter.id}
                    chapter={chapter}
                    comicId={comic.id}
                    isOrderingMode={isOrderingMode}
                    setSelectedChapter={setSelectedChapter}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {/* Previous */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-11 min-w-11 rounded-2xl px-4 text-sm font-semibold transition ${
                    page === currentPage
                      ? "bg-indigo-500 text-white"
                      : "border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-indigo-500 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* ================= THUMBNAIL MODAL ================= */}
      {selectedChapter && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-400 rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {selectedChapter.title}
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    {selectedChapter.total_pages} pages
                  </p>
                </div>

                <button
                  onClick={() => setSelectedChapter(null)}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                >
                  Close
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[80vh] overflow-y-auto p-5">
                {selectedChapter.pages.length === 0 ? (
                  <div className="flex items-center justify-center py-20 text-sm text-zinc-500">
                    No thumbnails available
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {selectedChapter.pages.map((page) => {
                      const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${page.filepath}`;

                      return (
                        <div
                          key={page.id}
                          className="group relative aspect-3/4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition hover:border-indigo-500/40"
                        >
                          {/* Page Badge */}
                          <span className="absolute left-2 top-2 z-10 rounded-lg bg-zinc-950/90 px-2 py-1 text-[10px] font-bold text-indigo-400 backdrop-blur">
                            Page {page.page_number}
                          </span>

                          {/* Thumbnail */}
                          <img
                            src={imageUrl}
                            alt={page.filename}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />

                          {/* Hover */}
                          <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition group-hover:opacity-100" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Chapter Card Component
function SortableChapterCard({
  chapter,
  comicId,
  isOrderingMode,
  setSelectedChapter,
}: {
  chapter: ComicChapter;
  comicId: string;
  isOrderingMode: boolean;
  setSelectedChapter: (chapter: ComicChapter | null) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: chapter.id,
    disabled: !isOrderingMode,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    willChange: "transform",
  };

  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const thumbnail = chapter.pages?.[0]?.filepath
    ? `${baseUrl}${chapter.pages[0].filepath}`
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex min-h-22 items-center justify-between rounded-3xl border px-5 py-4 backdrop-blur-sm transition-all duration-200 ${
        isDragging
          ? "z-50 border-amber-500 bg-zinc-900 shadow-2xl shadow-amber-500/10"
          : isOrderingMode
            ? "border-amber-500/20 bg-amber-500/5 hover:bg-zinc-900/80"
            : "border-zinc-800 bg-zinc-900/40 hover:border-indigo-500/40 hover:bg-zinc-900/80"
      }`}
    >
      {/* Left */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition ${
              isOrderingMode
                ? "cursor-grab border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-amber-500 hover:text-white active:cursor-grabbing"
                : "pointer-events-none invisible opacity-0"
            }`}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Edit */}
          <Link
            href={`/comic/${comicId}/chapter/${chapter.id}/edit`}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition ${
              isOrderingMode
                ? "pointer-events-none invisible opacity-0"
                : "border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-white"
            }`}
          >
            <Pencil className="h-4 w-4" />
          </Link>

          {/* Number */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-800 text-sm font-bold text-zinc-200">
            {chapter.chapter_number}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-zinc-100">
              {chapter.title}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Released {new Date(chapter.published_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div
        className={`flex items-center gap-3 transition-all duration-200 ${
          isOrderingMode
            ? "pointer-events-none invisible opacity-0"
            : "visible opacity-100"
        }`}
      >
        {/* Badge */}
        <span className="hidden rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold text-emerald-300 shadow-sm shadow-emerald-500/10 sm:block">
          {chapter.censorship?.name || "Unknown"}
        </span>

        {/* Thumbnail */}
        <button
          onClick={() => setSelectedChapter(chapter)}
          className="group flex h-12 items-center gap-2 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-fuchsia-500 hover:bg-fuchsia-500/10 hover:text-white"
        >
          <ImageIcon className="h-4 w-4 transition group-hover:scale-110" />

          <span>Thumbnail</span>
        </button>

        {/* Read */}
        <Link
          href={`/comic/${comicId}/chapter/${chapter.id}`}
          className="group flex h-12 items-center gap-2 rounded-2xl bg-zinc-800 px-5 py-2 text-sm font-medium text-zinc-200 transition hover:bg-indigo-500 hover:text-white"
        >
          <BookOpen className="h-4 w-4 transition group-hover:scale-110" />
          <span>Read Chapter</span>
        </Link>
      </div>
    </div>
  );
}
