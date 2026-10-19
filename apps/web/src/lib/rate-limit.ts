/**
 * Small in-memory fixed-window limiter for form endpoints. Per server instance
 * only; put a shared store in front of it if the site runs on many instances.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const requests = new Map<string, { count: number; resetAt: number }>();

  return function isRateLimited(key: string) {
    const now = Date.now();
    // Drop expired windows once the map grows, so unique visitors do not
    // accumulate for the lifetime of the server process.
    if (requests.size > 1000) {
      for (const [entryKey, entry] of requests) {
        if (entry.resetAt < now) requests.delete(entryKey);
      }
    }
    const current = requests.get(key);

    if (!current || current.resetAt < now) {
      requests.set(key, { count: 1, resetAt: now + windowMs });
      return false;
    }

    current.count += 1;
    return current.count > limit;
  };
}

export function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}
