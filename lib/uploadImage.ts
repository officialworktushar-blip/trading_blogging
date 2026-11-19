"use client";

import { IMAGE_BUCKET, storagePathFromPublicUrl } from "@/lib/image-path";
import { createClient } from "@/lib/supabase-browser";

export { IMAGE_BUCKET } from "@/lib/image-path";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ImageFolder = "covers" | "content";

export type UploadedImage = {
  url: string;
  path: string;
};

export function validateImageFile(file: File): void {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    throw new Error("Use a JPG, PNG or WebP image.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Images must be 5 MB or smaller.");
  }
}

async function toWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const longest = Math.max(bitmap.width, bitmap.height);
  const scale = longest > 1600 ? 1600 / longest : 1;
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Your browser could not process this image.");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), "image/webp", 0.82);
  });
  if (!blob) throw new Error("Your browser could not convert this image.");
  if (blob.size > MAX_IMAGE_BYTES) {
    throw new Error("The compressed image is still over 5 MB.");
  }
  return blob;
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function uploadImage(
  file: File,
  folder: ImageFolder,
): Promise<UploadedImage> {
  validateImageFile(file);
  const webp = await toWebp(file);
  const path = `${folder}/${makeId()}.webp`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, webp, { contentType: "image/webp", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteImage(url: string | null | undefined): Promise<void> {
  const path = storagePathFromPublicUrl(url);
  if (!path) return;
  const supabase = createClient();
  const { error } = await supabase.storage.from(IMAGE_BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}
