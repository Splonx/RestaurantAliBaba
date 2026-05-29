export function normalizeWhatsAppNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function createWhatsAppUrl(number: string, message: string) {
  return `https://wa.me/${normalizeWhatsAppNumber(number)}?text=${encodeURIComponent(message)}`;
}

export const defaultReservationMessage =
  "Bonjour Restaurant Ali Baba, je souhaite réserver une table.\nNom :\nTéléphone :\nDate :\nHeure :\nNombre de personnes :\nMessage :";
