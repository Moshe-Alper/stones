import { afterEach, describe, expect, it, vi } from "vitest"
import { PREFERRED_TIME_OPTIONS } from "@/data/contact"
import { POST } from "./route"

function createRequest(body: unknown) {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/contact", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("accepts a valid inquiry through simulated delivery", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => undefined)
    const response = await POST(
      createRequest({
        name: "ישראל ישראלי",
        phone: "050-1234567",
        preferredTime: PREFERRED_TIME_OPTIONS[0],
        message: "אשמח לקבל פרטים נוספים.",
      }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        data: { delivered: true, mode: "simulated" },
        requestId: expect.any(String),
      }),
    )
    expect(log).toHaveBeenCalledWith(
      "contact_inquiry_simulated_delivery",
      expect.objectContaining({ operation: "create_contact_inquiry" }),
    )
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
  })
})
