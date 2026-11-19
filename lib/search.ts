export function sanitizeIlikeQuery(value: string): string {
  return value.replace(/[%,"\\()';]/g, " ").replace(/\s+/g, " ").trim();
}

export function ilikeSearch(query: string): string {
  const safe = sanitizeIlikeQuery(query);
  return `title.ilike.%${safe}%,excerpt.ilike.%${safe}%`;
}
