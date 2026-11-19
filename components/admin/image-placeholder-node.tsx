"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";

type PlaceholderStorage = {
  upload: (file: File, note: string) => Promise<string>;
  onError: (message: string) => void;
  onBusy: (busy: boolean) => void;
  onUploaded: (url: string) => void;
};

export type ImagePlaceholderOptions = PlaceholderStorage;

export function newPlaceholderId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function normalizePlaceholderIds(html: string): string {
  if (typeof document === "undefined") return html;
  const parsed = new DOMParser().parseFromString(html, "text/html");
  parsed.body
    .querySelectorAll("div.image-placeholder, div[data-image-placeholder]")
    .forEach((element) => {
    if (!element.getAttribute("data-id")) {
      element.setAttribute("data-id", newPlaceholderId());
    }
  });
  return parsed.body.innerHTML;
}

function ImagePlaceholderView({
  node,
  getPos,
  deleteNode,
  editor,
  updateAttributes,
}: NodeViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const dataId = String(node.attrs.dataId ?? "");
  const note = String(node.attrs.text ?? "");
  const storage = editor.storage.imagePlaceholder as
    | PlaceholderStorage
    | undefined;

  async function handleFile(file: File) {
    if (busy) return;
    setBusy(true);
    storage?.onBusy(true);
    try {
      if (!storage) throw new Error("Image upload is not available.");
      const url = await storage.upload(file, note);

      const position = getPos();
      let from = typeof position === "number" ? position : -1;
      let size = 1;
      let target = from >= 0 ? editor.state.doc.nodeAt(from) : null;

      if (
        !target ||
        target.type.name !== "imagePlaceholder" ||
        String(target.attrs.dataId ?? "") !== dataId
      ) {
        from = -1;
        editor.state.doc.descendants((child, childPos) => {
          if (
            from === -1 &&
            child.type.name === "imagePlaceholder" &&
            String(child.attrs.dataId ?? "") === dataId
          ) {
            from = childPos;
            size = child.nodeSize;
          }
        });
        target = from >= 0 ? editor.state.doc.nodeAt(from) : null;
        if (target) size = target.nodeSize;
      } else {
        size = target.nodeSize;
      }

      if (from < 0) throw new Error("This image box could not be found.");

      editor
        .chain()
        .insertContentAt(
          { from, to: from + size },
          { type: "image", attrs: { src: url, alt: note } },
        )
        .run();
      storage.onUploaded(url);
    } catch (error) {
      storage?.onError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
      storage?.onBusy(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    const file = Array.from(event.dataTransfer.files).find((item) =>
      item.type.startsWith("image/"),
    );
    if (!file) return;
    event.preventDefault();
    event.stopPropagation();
    void handleFile(file);
  }

  return (
    <NodeViewWrapper
      as="div"
      className="image-placeholder-box my-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4"
      data-id={dataId}
      onDrop={handleDrop}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-[180px] flex-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Image note / mockup suggestion
          </label>
          <input
            value={note}
            onChange={(event) => updateAttributes({ text: event.target.value })}
            placeholder="Describe the image needed here…"
            className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm text-ink-900 outline-none focus:border-teal-500"
          />
        </div>
        <div className="flex items-center gap-2 pt-5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md bg-navy-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
            {busy ? "Uploading…" : "Upload image"}
          </button>
          <button
            type="button"
            onClick={deleteNode}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-red-600 hover:border-red-200"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Delete box
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Drop an image here, or use Upload image. It replaces this exact box.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void handleFile(file);
        }}
      />
    </NodeViewWrapper>
  );
}

export const ImagePlaceholderNode = Node.create<ImagePlaceholderOptions>({
  name: "imagePlaceholder",
  group: "block",
  atom: true,
  draggable: true,

  addOptions() {
    return {
      upload: async () => {
        throw new Error("Image upload is not available.");
      },
      onError: () => undefined,
      onBusy: () => undefined,
      onUploaded: () => undefined,
    };
  },

  addStorage() {
    return {
      upload: this.options.upload,
      onError: this.options.onError,
      onBusy: this.options.onBusy,
      onUploaded: this.options.onUploaded,
    };
  },

  addAttributes() {
    return {
      dataId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) =>
          attributes.dataId ? { "data-id": String(attributes.dataId) } : {},
      },
      text: {
        default: "",
        parseHTML: (element) => element.textContent ?? "",
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [
      { tag: "div.image-placeholder" },
      { tag: "div[data-image-placeholder]" },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "image-placeholder" }),
      String(node.attrs.text ?? ""),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImagePlaceholderView);
  },
});
