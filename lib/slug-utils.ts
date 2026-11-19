import slugify from "slugify";

export function toSlug(value: string): string {
  return (
    slugify(value, { lower: true, strict: true, trim: true }) || "untitled"
  );
}

export function uniqueSlug(
  base: string,
  taken: string[],
  keep?: string | null,
): string {
  const root = toSlug(base);
  const used = new Set(taken.map((slug) => slug.toLowerCase()));
  if (keep && keep.toLowerCase() === root.toLowerCase()) return root;
  if (!used.has(root.toLowerCase())) return root;

  let suffix = 2;
  let candidate = `${root}-${suffix}`;
  while (used.has(candidate.toLowerCase())) {
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
  return candidate;
}
