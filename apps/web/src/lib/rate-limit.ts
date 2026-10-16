/**
 * Small in-memory fixed-window limiter for form endpoints. Per server instance
 * only; put a shared store in front of it if the site runs on many instances.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const requests = new Map<string, { count: number; resetAt: number }>();

  return function isRateLimited(key: string) {
    const now = Date.now();
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
