/** Every key optional, recursively: a translation may cover only part of the English text. */
export type DeepPartial<T> = T extends string
  ? string
  : T extends readonly (infer Item)[]
    ? readonly DeepPartial<Item>[]
    : T extends object
      ? { [Key in keyof T]?: DeepPartial<T[Key]> }
      : T;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Overlays a translation on the English messages. Missing or empty entries keep
 * the English text, so the site never shows a raw key or a blank label.
 * A translated list must have the same length as the English one; otherwise the
 * English list is used, so items never come out half-translated or misaligned.
 */
export function withFallback<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (typeof base === "string") {
    return (typeof override === "string" && override.trim() !== "" ? override : base) as T;
  }
  if (Array.isArray(base)) {
    if (!Array.isArray(override) || override.length !== base.length) return base;
    return base.map((item, index) => withFallback(item, override[index])) as T;
  }
  if (isPlainObject(base)) {
    if (!isPlainObject(override)) return base;
    const merged: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(base)) merged[key] = withFallback(value, override[key]);
    return merged as T;
  }
  return base;
}

/** "Hello {name}" + { name: "Asha" } → "Hello Asha". Unknown placeholders are left as written. */
export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
