export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "Aucune modification";
  return new Intl.DateTimeFormat("fr-MA", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function displayPrice(price?: string | null) {
  return price && price.trim().length > 0 ? price : "Prix à confirmer";
}
