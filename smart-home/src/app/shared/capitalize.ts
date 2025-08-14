export function capitalize(string_: string): string {
  if (!string_) return string_;
  return string_.charAt(0).toUpperCase() + string_.slice(1);
}

export function uncapitalize(string_: string): string {
  return string_.charAt(0).toLowerCase() + string_.slice(1);
}

export function normalizeId(string_: string): string {
  return string_.trim().toLowerCase();
}
