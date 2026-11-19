export const IMAGE_BUCKET = "blog-images";

export function storagePathFromPublicUrl(
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  try {
    const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
    const parsed = new URL(url);
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return null;
    return decodeURIComponent(parsed.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}
