"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
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
import {
  Save,
  BookOpen,
  ImageIcon,
  Trash2,
  GripVertical,
  Plus,
} from "lucide-react";
import { CSS } from "@dnd-kit/utilities";

export default function EditChapterPage() {
  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setPages((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);
      return reordered.map((item, idx) => ({
        ...item,
        page: idx + 1,
      }));
    });
  };

  // Pages State
  const [pages, setPages] = useState<
    {
      id: string;
      page: number;
      url?: string;
      file?: File;
    }[]
  >(
    Array.from({ length: 0 }).map((_, idx) => ({
      id: crypto.randomUUID(),
      page: idx + 1,
    })),
  );
  const handleAddPages = () => {
    const currentLength = pages.length;
    const newPages = Array.from({ length: 5 }).map((_, idx) => ({
      id: crypto.randomUUID(),
      page: currentLength + idx + 1,
    }));
    setPages((prev) => [...prev, ...newPages]);
  };
  const handleUploadPages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const currentLength = pages.length;
    const newPages = files.map((file, idx) => ({
      id: crypto.randomUUID(),
      page: currentLength + idx + 1,
      file,
      url: URL.createObjectURL(file),
    }));
    setPages((prev) => [...prev, ...newPages]);
  };
  const handleClearPages = () => {
    setPages([]);
  };
  const handleDeletePage = (id: string) => {
    const filtered = pages.filter((page) => page.id !== id);
    const normalized = filtered.map((page, idx) => ({
      ...page,
      page: idx + 1,
    }));
    setPages(normalized);
  };
  const inputId = "chapter-pages-upload";

  return (
    <main className="min-h-screen bg-zinc-950">
      <input
        type="file"
        id={inputId}
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleUploadPages}
        onClick={(e) => {
          (e.target as HTMLInputElement).value = "";
        }}
      />
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4">
          {/* ================= LEFT ================= */}
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Edit Chapter
              </p>

              <h1 className="text-2xl font-black text-white">Chapter 120</h1>
            </div>
          </div>

          {/* ================= CENTER ================= */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-indigo-400" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Comic ID
              </span>

              <span className="font-mono text-sm font-bold text-white">
                #000001
              </span>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/comic/solo-leveling">
              <button className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white">
                Cancel
              </button>
            </Link>

            <button className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <div className="grid gap-6 p-6 xl:grid-cols-[360px_1fr]">
        {/* ================= LEFT ================= */}
        <div className="space-y-6">
          {/* Metadata */}
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="mb-6 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-400" />

              <h2 className="text-lg font-bold text-white">Chapter Metadata</h2>
            </div>

            <div className="space-y-5">
              {/* Chapter Number */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Chapter Number
                </label>

                <input
                  type="text"
                  defaultValue="120"
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Chapter Title
                </label>

                <input
                  type="text"
                  defaultValue="The Awakening"
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Content
                </label>

                <select className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500">
                  <option>Uncensored</option>
                  <option>Censored</option>
                </select>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
            <h2 className="mb-4 text-lg font-bold text-red-300">Danger Zone</h2>

            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20">
              <Trash2 className="h-4 w-4" />
              Delete Chapter
            </button>
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
              {/* Add */}
              <button
                onClick={() => document.getElementById(inputId)?.click()}
                className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 transition hover:border-indigo-500 hover:bg-indigo-500/10 hover:text-white"
              >
                <Plus className="h-4 w-4" />
                Add Pages
              </button>

              {/* Clear */}
              <button
                onClick={handleClearPages}
                className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 transition hover:border-red-500 hover:bg-red-500/10 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>

          {/* Empty State */}
          {pages.length === 0 ? (
            <div className="flex h-120 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900">
                <ImageIcon className="h-8 w-8 text-zinc-600" />
              </div>

              <h3 className="text-lg font-bold text-white">
                No Pages Uploaded
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                Start adding chapter pages to preview and manage them here.
              </p>

              <button
                onClick={() => document.getElementById(inputId)?.click()}
                className="mt-6 flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                <Plus className="h-4 w-4" />
                Add Pages
              </button>
            </div>
          ) : (
            /* Pages Grid */
            <div className="p-5">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                autoScroll={false}
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

// ================= SORTABLE PAGE CARD =================
const SortablePageCard = React.memo(function SortablePageCard({
  page,
  onDelete,
}: {
  page: {
    id: string;
    page: number;
    url?: string;
  };
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
    transition,
    willChange: "transform",
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative overflow-hidden rounded-2xl border bg-zinc-950
        will-change-transform select-none
        ${
          isDragging
            ? "z-50 border-indigo-500 ring-2 ring-indigo-500/30"
            : "border-zinc-800 hover:border-indigo-500/40"
        }
      `}
    >
      {/* Image */}
      <div className="aspect-3/4 overflow-hidden bg-zinc-800">
        {page.url ? (
          <img
            src={page.url}
            alt={`Page ${page.page}`}
            draggable={false}
            loading="lazy"
            className={`
              h-full w-full object-cover
              pointer-events-none select-none
              ${isDragging ? "" : "transition-transform duration-200 group-hover:scale-[1.02]"}
            `}
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

      {/* Overlay */}
      <div
        className={`
          absolute inset-0 flex items-end justify-between p-3
          transition-opacity duration-150
          ${
            isDragging
              ? "bg-black/20 opacity-100"
              : "bg-black/40 opacity-0 group-hover:opacity-100"
          }
        `}
      >
        {/* Drag */}
        <button
          {...attributes}
          {...listeners}
          className="
            cursor-grab active:cursor-grabbing
            rounded-xl bg-zinc-950/90 p-2
            text-zinc-300 backdrop-blur
            transition hover:text-white
            touch-none
          "
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(page.id)}
          className="
            rounded-xl bg-red-500/90 p-2
            text-white backdrop-blur
            transition hover:bg-red-600
          "
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});
