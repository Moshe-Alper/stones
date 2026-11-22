// Israeli ID (teudat zehut) check-digit validation.
export function isValidIsraeliId(raw: string): boolean {
  const digits = raw.trim()
  if (!/^\d{5,9}$/.test(digits)) return false
  const padded = digits.padStart(9, "0")
  let sum = 0
  for (let i = 0; i < 9; i++) {
    const step = Number(padded[i]) * (i % 2 === 0 ? 1 : 2)
    sum += step > 9 ? step - 9 : step
  }
  return sum % 10 === 0
}
