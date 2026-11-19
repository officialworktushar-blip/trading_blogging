"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Image as ImageIcon,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Code,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  ImagePlaceholderNode,
  newPlaceholderId,
  normalizePlaceholderIds,
} from "@/components/admin/image-placeholder-node";
import { uploadImage } from "@/lib/uploadImage";

type TiptapEditorProps = {
  initialContent?: string;
  onChange: (html: string) => void;
  onUploadingChange?: (busy: boolean) => void;
  onError?: (message: string) => void;
};

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: ReactNode;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`rounded-md p-2 transition-colors disabled:opacity-40 motion-reduce:transition-none ${
        active
          ? "bg-teal-50 text-teal-700"
          : "text-ink-700 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({
  initialContent = "",
  onChange,
  onUploadingChange,
  onError,
}: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const busyRef = useRef(onUploadingChange);
  const errorRef = useRef(onError);

  useEffect(() => {
    onChangeRef.current = onChange;
    busyRef.current = onUploadingChange;
    errorRef.current = onError;
  }, [onChange, onError, onUploadingChange]);

  const reportError = useCallback((error: unknown) => {
    errorRef.current?.(
      error instanceof Error ? error.message : "Image upload failed.",
    );
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      ImagePlaceholderNode.configure({
        upload: async (file: File) => {
          const result = await uploadImage(file, "content");
          return result.url;
        },
        onError: reportError,
        onBusy: (busy: boolean) => busyRef.current?.(busy),
        onUploaded: () => undefined,
      }),
    ],
    content: normalizePlaceholderIds(initialContent),
    onUpdate: ({ editor: current }) => onChangeRef.current(current.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose-sm min-h-[320px] w-full rounded-b-lg border border-slate-300 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-teal-500 [&_h2]:mt-4 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-teal-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-navy-950 [&_pre]:p-3 [&_pre]:text-slate-100 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_a]:text-teal-700 [&_a]:underline [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg",
      },
      handlePaste: (view, event) => {
        const file = Array.from(event.clipboardData?.files ?? []).find((item) =>
          item.type.startsWith("image/"),
        );
        if (!file) return false;
        event.preventDefault();
        void (async () => {
          busyRef.current?.(true);
          try {
            const result = await uploadImage(file, "content");
            const { state, dispatch } = view;
            const image = state.schema.nodes.image.create({
              src: result.url,
              alt: "",
            });
            dispatch(state.tr.insert(state.selection.from, image));
          } catch (error) {
            reportError(error);
          } finally {
            busyRef.current?.(false);
          }
        })();
        return true;
      },
      handleDrop: (view, event) => {
        const file = Array.from(event.dataTransfer?.files ?? []).find((item) =>
          item.type.startsWith("image/"),
        );
        if (!file) return false;
        event.preventDefault();
        const position = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        })?.pos;
        void (async () => {
          busyRef.current?.(true);
          try {
            const result = await uploadImage(file, "content");
            const { state, dispatch } = view;
            const image = state.schema.nodes.image.create({
              src: result.url,
              alt: "",
            });
            const at = typeof position === "number" ? position : state.selection.from;
            dispatch(state.tr.insert(at, image));
          } catch (error) {
            reportError(error);
          } finally {
            busyRef.current?.(false);
          }
        })();
        return true;
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    void (async () => {
      busyRef.current?.(true);
      try {
        const result = await uploadImage(file, "content");
        editor?.chain().focus().setImage({ src: result.url, alt: "" }).run();
      } catch (error) {
        reportError(error);
      } finally {
        busyRef.current?.(false);
      }
    })();
  }

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-slate-300">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-slate-300" />
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-slate-300" />
        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-slate-300" />
        <ToolbarButton title="Add link" active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Insert image"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Add image box"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: "imagePlaceholder",
                attrs: {
                  dataId: newPlaceholderId(),
                  text: "Image note / mockup suggestion",
                },
              })
              .run()
          }
        >
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-slate-300" />
        <ToolbarButton
          title="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}
