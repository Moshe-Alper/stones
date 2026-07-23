import { afterEach, describe, expect, it, vi } from "vitest"

const sendMock = vi.fn()

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(function Resend() {
    return { emails: { send: sendMock } }
  }),
}))

const { deliverContactInquiry } = await import("./contact-inquiry-delivery")

const BASE_INPUT = {
  requestId: "11111111-1111-1111-1111-111111111111",
  name: "ישראל ישראלי",
  phone: "050-1234567",
  preferredTime: "בוקר (08:00 - 12:00)",
  message: "אשמח לקבל פרטים נוספים.",
}

function stubEmailConfig() {
  vi.stubEnv("CONTACT_INQUIRY_DELIVERY_MODE", "email")
  vi.stubEnv("RESEND_API_KEY", "re_test_key")
  vi.stubEnv("CONTACT_INQUIRY_FROM", "Alper Matzevot <inquiries@example.com>")
  vi.stubEnv("CONTACT_INQUIRY_TO", "family@example.com")
}

describe("deliverContactInquiry", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    sendMock.mockReset()
  })

  it("returns delivered/simulate and never calls the SDK in simulate mode", async () => {
    vi.stubEnv("CONTACT_INQUIRY_DELIVERY_MODE", "simulate")

    const result = await deliverContactInquiry(BASE_INPUT)

    expect(result).toEqual({ outcome: "delivered", mode: "simulate" })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it("sends a plain-text email with the expected fields and idempotency key", async () => {
    stubEmailConfig()
    sendMock.mockResolvedValue({ data: { id: "email_123" }, error: null })

    const result = await deliverContactInquiry(BASE_INPUT)

    expect(result).toEqual({
      outcome: "delivered",
      mode: "email",
      providerMessageId: "email_123",
    })
    expect(sendMock).toHaveBeenCalledTimes(1)
    const [payload, options] = sendMock.mock.calls[0]
    expect(payload.from).toBe("Alper Matzevot <inquiries@example.com>")
    expect(payload.to).toBe("family@example.com")
    expect(payload.subject).toContain(BASE_INPUT.name)
    expect(payload.text).toContain(BASE_INPUT.name)
    expect(payload.text).toContain(BASE_INPUT.phone)
    expect(payload.text).toContain(BASE_INPUT.preferredTime)
    expect(payload.text).toContain(BASE_INPUT.message)
    expect(payload.text).toContain(BASE_INPUT.requestId)
    expect(options).toEqual({ idempotencyKey: BASE_INPUT.requestId })
  })

  it("fails closed when the delivery mode is unset or unrecognized", async () => {
    const result = await deliverContactInquiry(BASE_INPUT)

    expect(result).toEqual({
      outcome: "unavailable",
      mode: "unset",
      reason: "missing_configuration",
    })
    expect(sendMock).not.toHaveBeenCalled()
  })

  it.each(["RESEND_API_KEY", "CONTACT_INQUIRY_FROM", "CONTACT_INQUIRY_TO"])(
    "fails closed when %s is missing in email mode",
    async (missingVar) => {
      stubEmailConfig()
      vi.stubEnv(missingVar, "")

      const result = await deliverContactInquiry(BASE_INPUT)

      expect(result).toEqual({
        outcome: "unavailable",
        mode: "email",
        reason: "missing_configuration",
      })
      expect(sendMock).not.toHaveBeenCalled()
    },
  )

  it("retries once on a transient provider failure and succeeds", async () => {
    stubEmailConfig()
    sendMock
      .mockResolvedValueOnce({
        data: null,
        error: { name: "internal_server_error", statusCode: 500, message: "oops" },
      })
      .mockResolvedValueOnce({ data: { id: "email_456" }, error: null })

    const result = await deliverContactInquiry(BASE_INPUT)

    expect(result).toEqual({
      outcome: "delivered",
      mode: "email",
      providerMessageId: "email_456",
    })
    expect(sendMock).toHaveBeenCalledTimes(2)
    expect(sendMock.mock.calls[0][1]).toEqual({ idempotencyKey: BASE_INPUT.requestId })
    expect(sendMock.mock.calls[1][1]).toEqual({ idempotencyKey: BASE_INPUT.requestId })
  })

  it("does not retry a non-retryable (4xx) provider failure", async () => {
    stubEmailConfig()
    sendMock.mockResolvedValue({
      data: null,
      error: { name: "validation_error", statusCode: 422, message: "bad request" },
    })

    const result = await deliverContactInquiry(BASE_INPUT)

    expect(result).toEqual({
      outcome: "unavailable",
      mode: "email",
      reason: "provider_error",
    })
    expect(sendMock).toHaveBeenCalledTimes(1)
  })

  it("treats a persistent transient failure as unavailable after one retry", async () => {
    stubEmailConfig()
    sendMock.mockResolvedValue({
      data: null,
      error: { name: "internal_server_error", statusCode: 500, message: "oops" },
    })

    const result = await deliverContactInquiry(BASE_INPUT)

    expect(result).toEqual({
      outcome: "unavailable",
      mode: "email",
      reason: "provider_error",
    })
    expect(sendMock).toHaveBeenCalledTimes(2)
  })

  it("reports a timeout as unavailable after exhausting the retry", async () => {
    vi.useFakeTimers()
    stubEmailConfig()
    sendMock.mockImplementation(() => new Promise(() => {})) // never resolves

    const resultPromise = deliverContactInquiry(BASE_INPUT)
    await vi.advanceTimersByTimeAsync(8000)
    await vi.advanceTimersByTimeAsync(8000)
    const result = await resultPromise

    expect(result).toEqual({
      outcome: "unavailable",
      mode: "email",
      reason: "timeout",
    })
    expect(sendMock).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it("never logs to the console", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => undefined)
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined)
    stubEmailConfig()
    sendMock.mockResolvedValue({ data: { id: "email_789" }, error: null })

    await deliverContactInquiry(BASE_INPUT)

    expect(log).not.toHaveBeenCalled()
    expect(errorLog).not.toHaveBeenCalled()
  })
})
