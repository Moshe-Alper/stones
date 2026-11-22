import { describe, expect, it } from "vitest"
import { isValidIsraeliId } from "@/lib/id-number"
import { buildWhatsappUrl, toWhatsappPhone } from "@/lib/phone"
import { createSessionValue, verifySessionValue } from "@/lib/session"
import { renderTerms } from "@/lib/terms"
import { createAgreementSchema, signAgreementSchema } from "@/lib/validation"

describe("isValidIsraeliId", () => {
  it("accepts a number with a correct check digit", () => {
    expect(isValidIsraeliId("123456782")).toBe(true)
  })
  it("rejects a wrong check digit", () => {
    expect(isValidIsraeliId("123456789")).toBe(false)
  })
  it("rejects non-numeric input", () => {
    expect(isValidIsraeliId("12a456782")).toBe(false)
  })
})

describe("whatsapp phone", () => {
  it("normalizes a local mobile number", () => {
    expect(toWhatsappPhone("050-123-4567")).toBe("972501234567")
  })
  it("normalizes a +972 number", () => {
    expect(toWhatsappPhone("+972 50 123 4567")).toBe("972501234567")
  })
  it("falls back to a generic link when the phone is missing", () => {
    expect(buildWhatsappUrl("", "hi")).toBe("https://wa.me/?text=hi")
  })
})

describe("session cookie", () => {
  const secret = "test-secret-test-secret-test-secret"
  it("verifies a fresh value", () => {
    expect(verifySessionValue(createSessionValue(secret, 1_000_000), secret, 1_000_001)).toBe(true)
  })
  it("rejects a tampered value", () => {
    const value = createSessionValue(secret, 1_000_000)
    expect(verifySessionValue(`9999999999.${value.split(".")[1]}`, secret, 1_000_001)).toBe(false)
  })
  it("rejects an expired value", () => {
    expect(verifySessionValue(createSessionValue(secret, 0), secret, 1e12)).toBe(false)
  })
  it("rejects when no secret is configured", () => {
    expect(verifySessionValue(createSessionValue(secret), "")).toBe(false)
  })
})

describe("renderTerms", () => {
  const input = { amountIls: 1500, vatIncluded: true, jobDescription: "פתיחת מצבה כפולה" }
  it("is deterministic for the same input", () => {
    expect(renderTerms(input).hash).toBe(renderTerms(input).hash)
  })
  it("changes the hash when the amount changes", () => {
    expect(renderTerms({ ...input, amountIls: 1600 }).hash).not.toBe(renderTerms(input).hash)
  })
})

describe("validation", () => {
  it("rejects a non-positive amount", () => {
    const result = createAgreementSchema.safeParse({ clientName: "דני כהן", jobDescription: "פתיחת מצבה", amountIls: 0 })
    expect(result.success).toBe(false)
  })
  it("coerces a numeric string amount", () => {
    const result = createAgreementSchema.safeParse({ clientName: "דני כהן", jobDescription: "פתיחת מצבה", amountIls: "1500" })
    expect(result.success && result.data.amountIls).toBe(1500)
  })
  it("requires consent and a png signature to sign", () => {
    const result = signAgreementSchema.safeParse({
      signerName: "דני כהן",
      signerIdNumber: "123456782",
      consent: false,
      signatureImage: "data:image/png;base64,AAAA",
    })
    expect(result.success).toBe(false)
  })
  it("accepts a complete valid signature payload", () => {
    const result = signAgreementSchema.safeParse({
      signerName: "דני כהן",
      signerIdNumber: "123456782",
      consent: true,
      signatureImage: "data:image/png;base64,AAAA",
    })
    expect(result.success).toBe(true)
  })
})
