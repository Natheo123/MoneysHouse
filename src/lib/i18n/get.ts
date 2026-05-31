export function getNestedValue(obj: unknown, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);

  return typeof value === "string" ? value : undefined;
}

export function translate(dict: object, key: string, params?: Record<string, string | number>): string {
  const raw = getNestedValue(dict, key) ?? key;
  if (!params) return raw;
  return Object.entries(params).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    raw
  );
}
