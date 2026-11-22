// Normalizes an Israeli phone number to international digits (972XXXXXXXXX) for wa.me links.
// Returns null when the input is not a plausible Israeli number.
export function toWhatsappPhone(raw: string | null | undefined): string | null {
  if (!raw) return null
  let digits = raw.replace(/[^\d+]/g, "")
  if (digits.startsWith("+")) digits = digits.slice(1)
  if (digits.startsWith("972")) digits = digits.slice(3)
  else if (digits.startsWith("0")) digits = digits.slice(1)
  if (!/^[2-9]\d{7,8}$/.test(digits)) return null
  return `972${digits}`
}

export function buildWhatsappUrl(phone: string | null | undefined, text: string): string {
  const normalized = toWhatsappPhone(phone)
  const query = `text=${encodeURIComponent(text)}`
  return normalized ? `https://wa.me/${normalized}?${query}` : `https://wa.me/?${query}`
}
