import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import ContactForm from "./ContactForm"

describe("ContactForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("renders the inquiry fields from the approved design", () => {
    render(<ContactForm />)

    expect(screen.getByLabelText("שם מלא")).toBeInTheDocument()
    expect(screen.getByLabelText("מספר טלפון")).toBeInTheDocument()
    expect(screen.getByLabelText("זמן מועדף ליצירת קשר")).toBeInTheDocument()
    expect(screen.getByLabelText("הודעה / בקשה מיוחדת")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "שליחת בקשה למשפחה" }),
    ).toBeInTheDocument()
  })

  it("blocks an empty inquiry with an actionable validation message", async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)
    render(<ContactForm />)

    await user.click(
      screen.getByRole("button", { name: "שליחת בקשה למשפחה" }),
    )

    expect(screen.getByRole("alert")).toHaveTextContent(
      "אנא מלאו את כל השדות כדי שנוכל לחזור אליכם.",
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("submits a complete inquiry and announces success", async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        data: { delivered: true, mode: "simulated" },
      }),
    })
    vi.stubGlobal("fetch", fetchMock)
    render(<ContactForm />)

    await user.type(screen.getByLabelText("שם מלא"), "ישראל ישראלי")
    await user.type(screen.getByLabelText("מספר טלפון"), "050-1234567")
    await user.type(
      screen.getByLabelText("הודעה / בקשה מיוחדת"),
      "אשמח לקבל פרטים נוספים.",
    )
    await user.click(
      screen.getByRole("button", { name: "שליחת בקשה למשפחה" }),
    )

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    )
    expect(
      await screen.findByText("בקשתכם נשלחה למשפחה. נחזור אליכם בהקדם."),
    ).toBeInTheDocument()
  })

  it("surfaces a safe endpoint error and lets the visitor retry", async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: { message: "פרטי הפנייה חסרים או אינם תקינים." },
        }),
      }),
    )
    render(<ContactForm />)

    await user.type(screen.getByLabelText("שם מלא"), "ישראל ישראלי")
    await user.type(screen.getByLabelText("מספר טלפון"), "050-1234567")
    await user.type(
      screen.getByLabelText("הודעה / בקשה מיוחדת"),
      "אשמח לשוחח.",
    )
    await user.click(
      screen.getByRole("button", { name: "שליחת בקשה למשפחה" }),
    )

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "פרטי הפנייה חסרים או אינם תקינים.",
    )
  })
})
