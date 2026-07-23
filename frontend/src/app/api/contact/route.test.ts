import { afterEach, describe, expect, it, vi } from "vitest"
import { PREFERRED_TIME_OPTIONS } from "@/data/contact"

const deliverContactInquiryMock = vi.fn()

vi.mock("@/lib/contact-inquiry-delivery", () => ({
  deliverContactInquiry: deliverContactInquiryMock,
}))

const { POST } = await import("./route")

const VALID_INQUIRY = {
  name: "ישראל ישראלי",
  phone: "050-1234567",
  preferredTime: PREFERRED_TIME_OPTIONS[0],
  message: "אשמח לקבל פרטים נוספים.",
}

function createRequest(body: unknown, headers: Record<string, string> = {}) {
  const serialized = JSON.stringify(body)
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: serialized,
  })
}

describe("POST /api/contact", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    deliverContactInquiryMock.mockReset()
  })

  it("delivers a valid inquiry through the adapter and returns its mode", async () => {
    deliverContactInquiryMock.mockResolvedValue({
      outcome: "delivered",
      mode: "email",
      providerMessageId: "email_123",
    })
    const log = vi.spyOn(console, "info").mockImplementation(() => undefined)

    const response = await POST(createRequest(VALID_INQUIRY))
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload).toEqual(
      expect.objectContaining({
        data: { delivered: true, mode: "email" },
        requestId: expect.any(String),
      }),
    )
    expect(deliverContactInquiryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: VALID_INQUIRY.name,
        phone: VALID_INQUIRY.phone,
        preferredTime: VALID_INQUIRY.preferredTime,
        message: VALID_INQUIRY.message,
      }),
    )

    const loggedArgs = log.mock.calls.flat()
    const serializedLog = JSON.stringify(loggedArgs)
    expect(serializedLog).not.toContain(VALID_INQUIRY.name)
    expect(serializedLog).not.toContain(VALID_INQUIRY.phone)
    expect(serializedLog).not.toContain(VALID_INQUIRY.message)
  })

  it("returns structured field details for an invalid inquiry", async () => {
    const response = await POST(createRequest({ name: "", phone: "123" }))
    const payload = await response.json()

    expect(response.status).toBe(422)
    expect(payload).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          code: "INVALID_CONTACT_INQUIRY",
          details: expect.objectContaining({
            name: expect.any(String),
            phone: expect.any(String),
            preferredTime: expect.any(String),
            message: expect.any(String),
          }),
        }),
        requestId: expect.any(String),
      }),
    )
    expect(deliverContactInquiryMock).not.toHaveBeenCalled()
  })

  it("returns 400 for malformed JSON", async () => {
    const request = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not valid json",
    })

    const response = await POST(request)
    const payload = await response.json()

    expect(response.status).toBe(400)
    expect(payload.error.code).toBe("INVALID_JSON")
    expect(deliverContactInquiryMock).not.toHaveBeenCalled()
  })

  it("rejects a name longer than 100 characters", async () => {
    const response = await POST(
      createRequest({ ...VALID_INQUIRY, name: "א".repeat(101) }),
    )
    const payload = await response.json()

    expect(response.status).toBe(422)
    expect(payload.error.details.name).toEqual(expect.any(String))
    expect(deliverContactInquiryMock).not.toHaveBeenCalled()
  })

  it("rejects a message longer than 2000 characters", async () => {
    const response = await POST(
      createRequest({ ...VALID_INQUIRY, message: "א".repeat(2001) }),
    )
    const payload = await response.json()

    expect(response.status).toBe(422)
    expect(payload.error.details.message).toEqual(expect.any(String))
    expect(deliverContactInquiryMock).not.toHaveBeenCalled()
  })

  it("rejects an oversized request body without parsing it", async () => {
    const response = await POST(
      createRequest(VALID_INQUIRY, { "Content-Length": String(21 * 1024) }),
    )
    const payload = await response.json()

    expect(response.status).toBe(422)
    expect(payload.error.code).toBe("INVALID_CONTACT_INQUIRY")
    expect(deliverContactInquiryMock).not.toHaveBeenCalled()
  })

  it("returns a fake success and skips delivery when the honeypot is filled", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => undefined)

    const response = await POST(
      createRequest({ ...VALID_INQUIRY, website: "http://spam.example" }),
    )
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(payload).toEqual(
      expect.objectContaining({ data: { delivered: true, mode: "email" } }),
    )
    expect(deliverContactInquiryMock).not.toHaveBeenCalled()
    expect(log).toHaveBeenCalledWith(
      "contact_inquiry_delivery",
      expect.objectContaining({ outcome: "honeypot_rejected" }),
    )
  })

  it("returns 503 when delivery is unavailable, without leaking provider details", async () => {
    deliverContactInquiryMock.mockResolvedValue({
      outcome: "unavailable",
      mode: "email",
      reason: "provider_error",
    })

    const response = await POST(createRequest(VALID_INQUIRY))
    const payload = await response.json()

    expect(response.status).toBe(503)
    expect(payload).toEqual(
      expect.objectContaining({
        error: {
          code: "CONTACT_DELIVERY_UNAVAILABLE",
          message: expect.any(String),
        },
        requestId: expect.any(String),
      }),
    )
    expect(JSON.stringify(payload)).not.toContain("provider_error")
  })
})
