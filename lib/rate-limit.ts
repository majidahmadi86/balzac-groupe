import "server-only";

// Simple in-memory sliding window per IP and form. The site runs as a single
// Node process on the VPS, so process memory is enough; it resets on restart.

const WINDOW_MS = Number(process.env.FORM_RATE_WINDOW_MS) || 10 * 60 * 1000;
const MAX_PER_WINDOW = Number(process.env.FORM_RATE_LIMIT) || 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}
