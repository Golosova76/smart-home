export function isNullOrEmpty(value: unknown): value is "" | null | undefined {
  return value == null || value === "";
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value !== "";
}
