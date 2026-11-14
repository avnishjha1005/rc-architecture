const NETWORK_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "EAI_AGAIN",
  "ENETUNREACH",
  "ENOTFOUND",
  "ETIMEDOUT",
]);

function errorRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" ? value as Record<string, unknown> : undefined;
}

export function isSanityNetworkError(error: unknown): boolean {
  const current = errorRecord(error);
  if (!current) return false;
  if (current.isNetworkError === true) return true;
  if (typeof current.code === "string" && NETWORK_CODES.has(current.code)) return true;
  if (current.message === "fetch failed") return true;
  return current.cause ? isSanityNetworkError(current.cause) : false;
}

export function reportSanityError(message: string, error: unknown) {
  if (!isSanityNetworkError(error)) console.error(message, error);
}
