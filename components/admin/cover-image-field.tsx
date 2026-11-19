"use client";

import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { uploadImage, validateImageFile } from "@/lib/uploadImage";

type CoverImageFieldProps = {
  value: string;
  alt: string;
  note: string;
  onChange: (url: string) => void;
  onAltChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onBusyChange: (busy: boolean) => void;
  onError: (message: string) => void;
};

export function CoverImageField({
  value,
  alt,
  note,
  onChange,
  onAltChange,
  onNoteChange,
  onBusyChange,
  onError,
}: CoverImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File) {
    if (busy) return;
    setBusy(true);
    onBusyChange(true);
    try {
      validateImageFile(file);
      const uploaded = await uploadImage(file, "covers");
      onChange(uploaded.url);
      if (!alt) onAltChange(file.name.replace(/\.[^.]+$/, ""));
    } catch (error) {
      onError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setBusy(false);
      onBusyChange(false);
    }
  }

  async function handleRemove() {
    if (!value || busy) return;
    setBusy(true);
    onBusyChange(true);
    try {
      onChange("");
      onAltChange("");
      onNoteChange("");
    } finally {
      setBusy(false);
      onBusyChange(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = Array.from(event.dataTransfer.files).find((item) =>
      item.type.startsWith("image/"),
    );
    if (file) void handleFile(file);
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors motion-reduce:transition-none ${
          dragging ? "border-teal-500 bg-teal-50" : "border-slate-300 bg-slate-50"
        }`}
      >
        {value ? (
          <div
            role="img"
            aria-label={alt || "Cover image preview"}
            className="h-full min-h-[220px] w-full bg-cover bg-center"
            style={{ backgroundImage: `url("${value}")` }}
          />
        ) : (
          <div className="px-6 py-10 text-center">
            <ImagePlus className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-ink-900">
              Drop a cover image here
            </p>
            <p className="mt-1 text-xs text-ink-500">JPG, PNG or WebP · max 5 MB</p>
          </div>
        )}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-ink-900 shadow disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            {value ? "Replace" : "Upload"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => void handleRemove()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-red-600 shadow disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Remove
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cover-alt" className="mb-1.5 block text-sm font-medium text-ink-700">
            Alt text
          </label>
          <input
            id="cover-alt"
            value={alt}
            onChange={(event) => onAltChange(event.target.value)}
            placeholder="Describe the cover image"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="cover-note" className="mb-1.5 block text-sm font-medium text-ink-700">
            Image note / mockup suggestion
          </label>
          <input
            id="cover-note"
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder="e.g. chart with support and resistance"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
          />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void handleFile(file);
        }}
      />
    </div>
  );
}
