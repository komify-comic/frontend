"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Cropper from "react-easy-crop";
import {
  ArrowLeft,
  Save,
  ImageIcon,
  BookOpen,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { getCroppedImg } from "@/lib/cropImage";

export default function EditComicPage() {
  // Fix Metadata Modal states
  const [fixModal, setFixModal] = useState<{
    open: boolean;
    field: string;
    value: string;
    preview: string;
  }>({
    open: false,
    field: "",
    value: "",
    preview: "",
  });
  const [metadata, setMetadata] = useState({
    title: "",
    parodies: "",
    characters: "",
    artists: "",
    authors: "",
    groups: "",
    tags: "",
  });
  const fixParagraph = useCallback((text: any) => {
    if (!text) return "";
    let result = Array.isArray(text) ? text.join(", ") : String(text);
    result = result.replace(/[|♀♂•−]/g, ",");
    result = result.replace(/\s+\d+(\.\d+)?[km]?/gi, ",");
    const parts = result
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const unique = [...new Set(parts)];
    return unique.join(", ");
  }, []);
  const openFixModal = (field: string, value: string) => {
    setFixModal({
      open: true,
      field,
      value,
      preview: fixParagraph(value),
    });
  };
  const saveFixMetadata = () => {
    setMetadata((prev) => ({
      ...prev,
      [fixModal.field]: fixModal.preview,
    }));

    setFixModal({
      open: false,
      field: "",
      value: "",
      preview: "",
    });
  };
  const generateFixPreview = () => {
    setFixModal((prev) => ({
      ...prev,
      preview: fixParagraph(prev.value),
    }));
  };

  // Crop states
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [savedCrop, setSavedCrop] = useState({ x: 0, y: 0 });
  const [savedRotation, setSavedRotation] = useState(0);
  const [savedZoom, setSavedZoom] = useState(1);
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const resultStr = reader.result as string;
        setImageSrc(resultStr);
        setOriginalSrc(resultStr);
        setCrop({ x: 0, y: 0 });
        setRotation(0);
        setZoom(1);
        setSavedCrop({ x: 0, y: 0 });
        setSavedRotation(0);
        setSavedZoom(1);
      });
      reader.readAsDataURL(file);
    }
  };
  const handleEditExisting = (e: React.MouseEvent) => {
    e.preventDefault();
    if (originalSrc) {
      setCrop(savedCrop);
      setRotation(savedRotation);
      setZoom(savedZoom);
      setImageSrc(originalSrc);
    }
  };
  const saveCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const cropped = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
      );
      setCoverImage(cropped);
      setSavedCrop(crop);
      setSavedRotation(rotation);
      setSavedZoom(zoom);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
    }
  };
  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Komify
            </p>

            <h1 className="text-2xl font-black text-white">Edit Comic #1</h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            href="/comic/solo-leveling-ragnarok"
            className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            Cancel
          </Link>

          <button className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        {/* ================= LEFT ================= */}
        <div className="space-y-6">
          {/* Cover */}
          <section className="h-fit rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <ImageIcon className="h-4 w-4 text-indigo-400" />
                Cover
              </h2>

              {/* Status */}
              <select
                className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 outline-none transition focus:border-indigo-500"
                defaultValue="ongoing"
              >
                <option value="ongoing">Ongoing</option>
                <option value="not-completed">Not Completed</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Input File */}
            <input
              type="file"
              id="cover-upload"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
              onClick={(e) => {
                (e.target as HTMLInputElement).value = "";
              }}
            />

            {/* Preview */}
            <div
              onClick={(e) => {
                if (coverImage) {
                  handleEditExisting(e);
                } else {
                  document.getElementById("cover-upload")?.click();
                }
              }}
              className="group relative block aspect-2/3 cursor-pointer overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 transition hover:border-indigo-500/40"
            >
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="Comic Cover"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-zinc-500">
                  <div className="text-center">
                    <p className="mt-1 text-xs text-zinc-600">Cover</p>
                  </div>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                <span className="rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-2 text-xs font-semibold text-zinc-200 backdrop-blur-md">
                  {coverImage ? "Edit / Re-crop Image" : "Choose File"}
                </span>
              </div>
            </div>

            {/* Footer */}
            {coverImage && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    document.getElementById("cover-upload")?.click()
                  }
                  className="rounded-2xl border border-zinc-800 py-3 text-xs font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                >
                  Replace File
                </button>

                <button
                  onClick={() => setCoverImage(null)}
                  className="rounded-2xl border border-red-500/20 bg-red-500/10 py-3 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                >
                  Remove Cover
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-6">
          {/* Metadata */}
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="relative mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                Metadata
              </h2>

              <button className="flex items-center gap-2 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/20 hover:text-white">
                <Sparkles className="h-4 w-4" />
                Extract
              </button>
            </div>

            <div className="space-y-5">
              {[
                { label: "Title", key: "title" },
                { label: "Parodies", key: "parodies" },
                { label: "Characters", key: "characters" },
                { label: "Artists", key: "artists" },
                { label: "Authors", key: "authors" },
                { label: "Groups", key: "groups" },
                { label: "Tags", key: "tags" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    {field.label}
                  </label>

                  <div className="flex gap-2">
                    {/* Input */}
                    <input
                      type="text"
                      placeholder={field.label}
                      value={metadata[field.key as keyof typeof metadata]}
                      onChange={(e) =>
                        setMetadata((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-200 outline-none transition focus:border-indigo-500"
                    />

                    {/* Fix Button */}
                    {field.label !== "Title" && (
                      <button
                        onClick={() =>
                          openFixModal(
                            field.key,
                            metadata[field.key as keyof typeof metadata],
                          )
                        }
                        className="shrink-0 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-4 text-xs font-semibold text-indigo-400 transition hover:bg-indigo-500/20"
                      >
                        Fix
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Synopsis */}
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="mb-4 text-lg font-bold text-white">Synopsis</h2>

            <textarea
              rows={8}
              placeholder="Write synopsis..."
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-sm text-zinc-200 outline-none transition focus:border-indigo-500"
            />
          </section>
        </div>
      </div>

      {/* ================= FIX MODAL ================= */}
      {fixModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
            {/* Header */}
            <div className="border-b border-zinc-800 px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                Fix {fixModal.field}
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Clean metadata automatically
              </p>
            </div>

            {/* Body */}
            <div className="space-y-5 p-6">
              {/* Input */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Raw Metadata
                </label>

                <textarea
                  rows={6}
                  value={fixModal.value}
                  onChange={(e) => {
                    const value = e.target.value;

                    setFixModal((prev) => ({
                      ...prev,
                      value,
                      preview: fixParagraph(value),
                    }));
                  }}
                  placeholder="Paste raw metadata here..."
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-sm text-zinc-200 outline-none transition focus:border-indigo-500"
                />
              </div>

              {/* Preview */}
              <div>
                <div className="mb-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Preview
                  </label>
                </div>

                <div className="min-h-32 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-7 text-zinc-300">
                  {fixModal.preview || (
                    <span className="text-zinc-600">Preview result...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t border-zinc-800 p-5">
              <button
                onClick={() => setFixModal({ ...fixModal, open: false })}
                className="flex-1 rounded-2xl border border-zinc-800 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  saveFixMetadata();
                }}
                className="flex-1 rounded-2xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Apply Fix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL CROP ================= */}
      {imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-md">
          <div className="flex h-200 w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
            {/* Header */}
            <div className="border-b border-zinc-800 p-4 text-center font-bold text-zinc-100">
              Adjust Cover Image
            </div>

            {/* Cropper */}
            <div className="relative flex-1 bg-zinc-950">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={2 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Controls */}
            <div className="space-y-4 border-t border-zinc-800 bg-zinc-900/60 p-5">
              {/* Zoom */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-zinc-400">
                  Zoom
                </span>

                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-indigo-500"
                />
              </div>

              {/* Rotation */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">
                  Rotation
                </span>

                <button
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 transition hover:border-indigo-500 hover:text-white"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  Rotate 90°
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setImageSrc(null)}
                  className="flex-1 rounded-2xl border border-zinc-800 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={saveCroppedImage}
                  className="flex-1 rounded-2xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  Apply & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
