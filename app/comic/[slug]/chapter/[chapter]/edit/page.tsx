"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  RefreshCcw,
} from "lucide-react";
import { CSS } from "@dnd-kit/utilities";

type ChapterResponse = {
  comic: {
    id: string;
    title: string;
    seo_slug: string | null;
    legacy_id: number;
    cover_path: string | null;
    alternative_title: string | null;
  };

  pages: ChapterPage[];

  chapter: {
    id: string;
    title: string;
    chapter_number: string;

    language: {
      code: string;
      name: string;
    };

    censorship: {
      id: string;
      name: string;
    };

    created_at: string;
    updated_at: string;
    total_pages: number;
    published_at: string;
  };

  navigation: {
    next_chapter: string | null;
    prev_chapter: string | null;
  };
};
type ChapterPage = {
  id: string;
  width: number | null;
  height: number | null;
  filename: string;
  filepath: string;
  filesize: number | null;
  created_at: string;
  page_number: number;
};
type EditablePage = {
  id: string;
  page: number;
  filename?: string;
  url?: string;
  file?: File;
  isExisting?: boolean;
  isReplaced?: boolean;
};
type Censorship = {
  id: string;
  name: string;
};
type Language = {
  code: string;
  name: string;
};

type SortablePageCardProps = {
  page: EditablePage;
  onDelete: (id: string) => void;
  onReplace: (id: string, file: File) => void;
};

export default function EditChapterPage() {
  const router = useRouter();
  const params = useParams();

  const slug = params.slug as string;
  const chapterId = params.chapter as string;

  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  const [chapterData, setChapterData] = useState<ChapterResponse | null>(null);
  const [censorships, setCensorships] = useState<Censorship[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [chapterMetadata, setChapterMetadata] = useState({
    title: "",
    censorship_id: "",
    language_code: "",
  });
  useEffect(() => {
    const fetchCommonData = async () => {
      try {
        const [censorshipsRes, languagesRes] = await Promise.all([
          fetch(`${baseUrl}/system/censorships`),
          fetch(`${baseUrl}/system/languages`),
        ]);

        if (!censorshipsRes.ok || !languagesRes.ok) {
          throw new Error("Failed to fetch common data");
        }

        const censorshipsData: Censorship[] = await censorshipsRes.json();
        const languagesData: Language[] = await languagesRes.json();

        setCensorships(censorshipsData);
        setLanguages(languagesData);
      } catch (error) {
        console.error("Failed to fetch common data:", error);
      }
    };

    fetchCommonData();
  }, [baseUrl]);

  const [deletedPages, setDeletedPages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

      if (!chapterMetadata.censorship_id) {
        alert("Please select censorship");
        return;
      }

      if (!chapterMetadata.language_code) {
        alert("Please select language");
        return;
      }

      const payload = {
        // chapter_id: chapterId,
        title: chapterMetadata.title,
        censorship_id: chapterMetadata.censorship_id,
        language_code: chapterMetadata.language_code,
        pages: pages.map((page, index) => ({
          id: page.isExisting ? page.id : null,
          temp_id: !page.isExisting || page.isReplaced ? page.id : null,
          page_number: index + 1,
          action: page.isExisting
            ? page.isReplaced
              ? "replace"
              : "keep"
            : "create",
          filename: page.filename ?? null,
        })),
        deleted_pages: deletedPages,
      };

      // Validation: ensure deleted_pages only contains pages that actually exist in database
      const currentPageIds = pages.filter((p) => p.isExisting).map((p) => p.id);
      const validDeletedPages = deletedPages.filter(
        (id) => !currentPageIds.includes(id),
      );

      if (validDeletedPages.length !== deletedPages.length) {
        console.warn(
          "Filtered out invalid deleted pages:",
          deletedPages.filter((id) => !validDeletedPages.includes(id)),
        );
        payload.deleted_pages = validDeletedPages;
      }

      const formData = new FormData();
      formData.append("document", JSON.stringify(payload));
      pages.forEach((page) => {
        const shouldUpload =
          (!page.isExisting && page.file) ||
          (page.isExisting && page.isReplaced && page.file);

        if (shouldUpload) {
          formData.append(`files_${page.id}`, page.file!);
        }
      });

      const invalidReplace = pages.find(
        (page) => page.isExisting && page.isReplaced && !page.file,
      );

      if (invalidReplace) {
        alert("Some replaced pages have no file selected");
        return;
      }

      console.log("====================================");
      console.log("UPDATE CHAPTER - CURRENT STATE");
      console.log("Pages array:", pages);
      console.log("Deleted Pages:", deletedPages);
      console.log("====================================");
      console.log("UPDATE CHAPTER PAYLOAD");
      console.log("Payload pages:", payload.pages);
      console.log("Payload deleted_pages:", payload.deleted_pages);
      console.log(payload);
      console.log("====================================");

      const response = await fetch(`${baseUrl}/chapters/${chapterId}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        const message = Array.isArray(result.message)
          ? result.message.join(", ")
          : result.message;

        throw new Error(message || "Failed to update chapter");
      }

      alert("Chapter updated successfully");
      router.push(`/comic/${slug}`);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error ? error.message : "Failed to update chapter",
      );
    } finally {
      setIsSaving(false);
    }
  };
  const handleReplacePage = (pageId: string, file: File) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId
          ? {
              ...page,
              file,
              filename: file.name,
              url: URL.createObjectURL(file),
              isReplaced: true,
            }
          : page,
      ),
    );
  };

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

      // Defensive check: if either index is -1, abort reordering
      if (oldIndex === -1 || newIndex === -1) {
        console.warn("Invalid drag indices detected", {
          oldIndex,
          newIndex,
          activeId: active.id,
          overId: over.id,
        });
        return items;
      }

      const reordered = arrayMove(items, oldIndex, newIndex);
      return reordered.map((item, idx) => ({
        ...item,
        page: idx + 1,
      }));
    });
  };

  // Pages State
  const [pages, setPages] = useState<EditablePage[]>([]);
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
      filename: file.name,
      url: URL.createObjectURL(file),
    }));
    setPages((prev) => [...prev, ...newPages]);
  };
  const handleClearPages = () => {
    const existingIds = pages.filter((p) => p.isExisting).map((p) => p.id);
    setDeletedPages((prev) => [...prev, ...existingIds]);
    setPages([]);
  };
  const handleDeletePage = (id: string) => {
    setPages((currentPages) => {
      const page = currentPages.find((x) => x.id === id);

      // Track page for deletion if it's an existing page
      if (page?.isExisting) {
        setDeletedPages((prev) => (prev.includes(id) ? prev : [...prev, id]));
      }

      const filtered = currentPages.filter((page) => page.id !== id);
      const normalized = filtered.map((page, idx) => ({
        ...page,
        page: idx + 1,
      }));

      return normalized;
    });
  };
  const inputId = "chapter-pages-upload";

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/comics/${slug}/chapters/${chapterId}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chapter");
        }

        const data: ChapterResponse = await response.json();
        setChapterData(data);
        setChapterMetadata({
          title: data.chapter.title || "",
          censorship_id: data.chapter.censorship?.id || "",
          language_code: data.chapter.language?.code || "",
        });

        const mappedPages = data.pages
          .sort((a, b) => a.page_number - b.page_number)
          .map((page) => ({
            id: page.id,
            page: page.page_number,
            filename: page.filename,
            url: `${baseUrl}${page.filepath}`,
            isExisting: true,
          }));
        setPages(mappedPages);
      } catch (error) {
        console.error(error);
      }
    };

    if (slug && chapterId) {
      fetchChapter();
    }
  }, [slug, chapterId, baseUrl]);

  const handleDeleteChapter = async () => {
    const confirmed = window.confirm(
      `Delete chapter "${chapterMetadata.title}"?\n\nThis will permanently delete:\n- Chapter metadata\n- All chapter pages\n- All image files`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const response = await fetch(`${baseUrl}/chapters/${chapterId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to delete chapter");
      }

      alert("Chapter deleted successfully");
      router.push(`/comic/${slug}`);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Failed to delete chapter",
      );
    }
  };

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
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Edit Chapter
              </p>
            </div>
          </div>
          {/* ================= CENTER ================= */}
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
                  {chapterData?.comic.legacy_id || "-"}
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
                  #{chapterData?.chapter.chapter_number || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex items-center justify-end gap-3">
            <Link href={`/comic/${chapterData?.comic.id || slug}`}>
              <button className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white">
                Cancel
              </button>
            </Link>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
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
              {/* Title */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={chapterMetadata.title}
                  onChange={(e) =>
                    setChapterMetadata((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              {/* Censorship */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Censorship
                </label>
                <select
                  value={chapterMetadata.censorship_id}
                  onChange={(e) =>
                    setChapterMetadata((prev) => ({
                      ...prev,
                      censorship_id: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                >
                  {censorships.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Language
                </label>
                <select
                  value={chapterMetadata.language_code}
                  onChange={(e) =>
                    setChapterMetadata((prev) => ({
                      ...prev,
                      language_code: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                >
                  {languages.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
            <h2 className="mb-4 text-lg font-bold text-red-300">Danger Zone</h2>

            <button
              onClick={handleDeleteChapter}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
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
                {chapterData?.chapter.total_pages || pages.length} pages
                uploaded
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
                        onReplace={handleReplacePage}
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
  onReplace,
}: SortablePageCardProps) {
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

      {page.isReplaced && (
        <div className="absolute right-2 top-2">
          <span
            className="
              rounded-lg
              bg-amber-500/90
              px-2 py-1
              text-[10px]
              font-bold
              text-white
            "
          >
            REPLACED
          </span>
        </div>
      )}

      {/* Overlay */}
      <div
        className={`absolute inset-0 flex items-end justify-between gap-2 p-3 transition-opacity duration-150
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

        <label
          className="
            cursor-pointer
            rounded-xl
            bg-blue-500/90
            p-2
            text-white
            backdrop-blur
            transition
            hover:bg-blue-600
          "
        >
          <RefreshCcw className="h-4 w-4" />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              onReplace(page.id, file);

              e.target.value = "";
            }}
          />
        </label>

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
