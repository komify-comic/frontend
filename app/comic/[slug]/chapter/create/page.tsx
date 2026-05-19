"use client";

import Link from "next/link";
import { useRef, useState, memo } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  ImageIcon,
  BookOpen,
} from "lucide-react";

type ChapterPage = {
  id: string;
  page: number;
  url?: string;
};

export default function CreateChapterPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pages, setPages] = useState<ChapterPage[]>([]);
  const [language, setLanguage] = useState("English");
  const [chapterTitle, setChapterTitle] = useState("");
  const [contentType, setContentType] = useState("uncensored");

  /* ================= DND ================= */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const normalizePages = (items: ChapterPage[]) => {
    return items.map((page, idx) => ({
      ...page,
      page: idx + 1,
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setPages((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      return normalizePages(arrayMove(items, oldIndex, newIndex));
    });
  };

  /* ================= ADD PAGES ================= */
  const handleAddPages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const mapped = files.map((file, idx) => ({
      id: crypto.randomUUID(),
      page: pages.length + idx + 1,
      url: URL.createObjectURL(file),
    }));

    setPages((prev) => [...prev, ...mapped]);

    e.target.value = "";
  };

  /* ================= CLEAR ================= */
  const handleClearPages = () => {
    setPages([]);
  };

  /* ================= DELETE ================= */
  const handleDeletePage = (id: string) => {
    const filtered = pages.filter((page) => page.id !== id);

    setPages(normalizePages(filtered));
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4">
          {/* LEFT */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Create Chapter
            </p>

            <h1 className="text-2xl font-black text-white">Add New Chapter</h1>
          </div>

          {/* CENTER */}
          <div className="flex justify-center">
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-5 py-3 backdrop-blur-sm">
              {/* Comic ID */}
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-400" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Comic ID
                </span>

                <span className="font-mono text-sm font-bold text-white">
                  #1
                </span>
              </div>

              {/* Divider */}
              <div className="h-5 w-px bg-zinc-800" />

              {/* Chapter Number */}
              <div className="flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-amber-400" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Chapter
                </span>

                <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-300">
                  #120
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/comic/solo-leveling">
              <button className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white">
                Cancel
              </button>
            </Link>

            <button className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">
              <Save className="h-4 w-4" />
              Create Chapter
            </button>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <div className="grid gap-6 p-6 xl:grid-cols-[360px_1fr]">
        {/* ================= LEFT ================= */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="mb-6 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-400" />

              <h2 className="text-lg font-bold text-white">Chapter Metadata</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Chapter Title
                </label>

                <input
                  type="text"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  placeholder="Enter chapter title..."
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Language
                </label>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Content
                </label>

                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                >
                  <option value="uncensored">Uncensored</option>
                  <option value="censored">Censored</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-white">Chapter Pages</h2>

              <p className="mt-1 text-xs text-zinc-500">
                {pages.length} pages uploaded
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleAddPages}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
              >
                <Plus className="h-4 w-4" />
                Add Pages
              </button>

              <button
                onClick={handleClearPages}
                className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 transition hover:border-red-500 hover:bg-red-500/10 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>

          {/* Empty */}
          {pages.length === 0 ? (
            <div className="flex h-120 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900">
                <ImageIcon className="h-8 w-8 text-zinc-600" />
              </div>

              <h3 className="text-lg font-bold text-white">
                No Pages Uploaded
              </h3>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-6 flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                <Plus className="h-4 w-4" />
                Add Pages
              </button>
            </div>
          ) : (
            <div className="p-5">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={pages.map((p) => p.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {pages.map((page) => (
                      <SortablePageCard
                        key={page.id}
                        page={page}
                        onDelete={handleDeletePage}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ================= CARD ================= */
const SortablePageCard = memo(function SortablePageCard({
  page,
  onDelete,
}: {
  page: ChapterPage;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: page.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    willChange: "transform",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-2xl border bg-zinc-950 ${
        isDragging
          ? "z-50 border-indigo-500 shadow-2xl shadow-indigo-500/20"
          : "border-zinc-800"
      }`}
    >
      {/* Image */}
      <div className="aspect-3/4 overflow-hidden bg-zinc-800">
        {page.url ? (
          <img
            src={page.url}
            alt={`Page ${page.page}`}
            loading="lazy"
            draggable={false}
            className="h-full w-full select-none object-cover pointer-events-none"
          />
        ) : (
          <div className="h-full w-full bg-zinc-800" />
        )}
      </div>

      {/* Badge */}
      <div className="absolute left-2 top-2">
        <span className="rounded-lg bg-zinc-950/90 px-2 py-1 text-[10px] font-bold text-indigo-400 backdrop-blur">
          #{page.page}
        </span>
      </div>

      {/* Hover */}
      <div className="absolute inset-0 flex items-end justify-between bg-black/40 p-3 opacity-0 transition-opacity group-hover:opacity-100">
        {/* Drag */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab rounded-xl bg-zinc-950/90 p-2 text-zinc-300 backdrop-blur transition hover:text-white active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(page.id)}
          className="rounded-xl bg-red-500/90 p-2 text-white backdrop-blur transition hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});
