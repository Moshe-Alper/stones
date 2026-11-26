import { screen, waitFor } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
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
      screen.getByRole("button", { name: "שליחת הבקשה" }),
    ).toBeInTheDocument()
  })

  it("blocks an empty inquiry with an actionable validation message", async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)
    render(<ContactForm />)

    await user.click(
      screen.getByRole("button", { name: "שליחת הבקשה" }),
    )

    expect(screen.getByRole("alert")).toHaveTextContent(
      "אנא מלאו את כל השדות כדי שנוכל לחזור אליכם.",
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("marks empty required fields invalid and focuses the first one", async () => {
    const user = userEvent.setup()
    vi.stubGlobal("fetch", vi.fn())
    render(<ContactForm />)

    await user.type(screen.getByLabelText("שם מלא"), "ישראל")
    await user.click(screen.getByRole("button", { name: "שליחת הבקשה" }))

    const phone = screen.getByLabelText("מספר טלפון")
    expect(screen.getByLabelText("שם מלא")).not.toHaveAttribute("aria-invalid")
    expect(phone).toHaveAttribute("aria-invalid", "true")
    expect(phone).toHaveAccessibleDescription("אנא מלאו את כל השדות כדי שנוכל לחזור אליכם.")
    expect(screen.getByLabelText("הודעה / בקשה מיוחדת")).toHaveAttribute("aria-invalid", "true")
    expect(phone).toHaveFocus()
  })

  it("submits a complete inquiry and announces success", async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        data: { delivered: true, mode: "email" },
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
      screen.getByRole("button", { name: "שליחת הבקשה" }),
    )

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      }),
    )
    const [, requestInit] = fetchMock.mock.calls[0]
    expect(JSON.parse(requestInit.body as string)).toEqual(
      expect.objectContaining({ website: "" }),
    )
    expect(
      await screen.findByText("בקשתכם נשלחה בהצלחה. נחזור אליכם בהקדם."),
    ).toBeInTheDocument()
  })

  it("keeps the honeypot field out of reach of real visitors", () => {
    render(<ContactForm />)

    const honeypot = document.getElementById(
      "contact-website",
    ) as HTMLInputElement

    expect(honeypot).not.toBeNull()
    expect(honeypot).toHaveAttribute("tabIndex", "-1")
    expect(
      screen.queryByRole("textbox", { name: "אתר אינטרנט" }),
    ).not.toBeInTheDocument()
  })

  it("disables the submit button and sends only one request while pending", async () => {
    const user = userEvent.setup()
    let resolveFetch: (value: unknown) => void = () => {}
    const fetchMock = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve
      }),
    )
    vi.stubGlobal("fetch", fetchMock)
    render(<ContactForm />)

    await user.type(screen.getByLabelText("שם מלא"), "ישראל ישראלי")
    await user.type(screen.getByLabelText("מספר טלפון"), "050-1234567")
    await user.type(
      screen.getByLabelText("הודעה / בקשה מיוחדת"),
      "אשמח לקבל פרטים נוספים.",
    )

    const submitButton = screen.getByRole("button", {
      name: /שולחים|שליחת הבקשה/,
    })
    await user.click(submitButton)
    await waitFor(() => expect(submitButton).toBeDisabled())
    await user.click(submitButton)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    resolveFetch({
      ok: true,
      json: vi.fn().mockResolvedValue({
        data: { delivered: true, mode: "email" },
      }),
    })
  })

  it("preserves entered values and shows a retryable message on 503", async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: {
            code: "CONTACT_DELIVERY_UNAVAILABLE",
            message: "לא הצלחנו לשלוח את הבקשה כעת. נסו שוב בעוד מספר דקות או צרו קשר טלפוני.",
          },
        }),
      }),
    )
    render(<ContactForm />)

    await user.type(screen.getByLabelText("שם מלא"), "ישראל ישראלי")
    await user.type(screen.getByLabelText("מספר טלפון"), "050-1234567")
    await user.type(
      screen.getByLabelText("הודעה / בקשה מיוחדת"),
      "אשמח לקבל פרטים נוספים.",
    )
    await user.click(
      screen.getByRole("button", { name: "שליחת הבקשה" }),
    )

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "לא הצלחנו לשלוח את הבקשה כעת. נסו שוב בעוד מספר דקות או צרו קשר טלפוני.",
    )
    expect(screen.getByLabelText("שם מלא")).toHaveValue("ישראל ישראלי")
    expect(screen.getByLabelText("מספר טלפון")).toHaveValue("050-1234567")
    expect(screen.getByLabelText("הודעה / בקשה מיוחדת")).toHaveValue(
      "אשמח לקבל פרטים נוספים.",
    )
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
      screen.getByRole("button", { name: "שליחת הבקשה" }),
    )

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "פרטי הפנייה חסרים או אינם תקינים.",
    )
  })
})
