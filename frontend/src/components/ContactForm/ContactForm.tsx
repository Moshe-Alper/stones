"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { PREFERRED_TIME_OPTION_IDS, type ContactInquiry } from "@/data/contact"
import styles from "./ContactForm.module.css"

const INITIAL_VALUES: ContactInquiry = {
  name: "",
  phone: "",
  preferredTime: PREFERRED_TIME_OPTION_IDS[0],
  message: "",
  website: "",
}

const REQUIRED_FIELDS = ["name", "phone", "preferredTime", "message"] as const

type SubmissionState = {
  type: "idle" | "submitting" | "success" | "error"
  message: string
}

const STATUS_ID = "contact-form-status"

const INITIAL_SUBMISSION_STATE: SubmissionState = {
  type: "idle",
  message: "",
}

export default function ContactForm() {
  const t = useTranslations("ContactForm")
  const locale = useLocale()
  const [values, setValues] = useState<ContactInquiry>(INITIAL_VALUES)
  const [submission, setSubmission] = useState<SubmissionState>(
    INITIAL_SUBMISSION_STATE,
  )
  // Required fields left empty on the last submit; marked aria-invalid and tied
  // to the status message so screen readers announce which field is wrong (.plan/024).
  const [invalidFields, setInvalidFields] = useState<string[]>([])

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const field = event.target.name as keyof ContactInquiry
    setValues((current) => ({ ...current, [field]: event.target.value }))
    if (event.target.value.trim()) {
      setInvalidFields((current) => current.filter((name) => name !== field))
    }

    if (submission.type === "error") {
      setSubmission(INITIAL_SUBMISSION_STATE)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const missingFields = REQUIRED_FIELDS.filter((field) => !values[field].trim())
    setInvalidFields(missingFields)

    if (missingFields.length > 0) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${missingFields[0]}"]`)?.focus()
      setSubmission({
        type: "error",
        message: t("errorMissingFields"),
      })
      return
    }

    setSubmission({ type: "submitting", message: t("submittingStatus") })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-locale": locale },
        body: JSON.stringify(values),
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(payload?.error?.message ?? t("errorGeneric"))
      }

      setSubmission({
        type: "success",
        message: t("successMessage"),
      })
      setValues(INITIAL_VALUES)
    } catch (error) {
      setSubmission({
        type: "error",
        message: error instanceof Error ? error.message : t("errorGeneric"),
      })
    }
  }

  const isSubmitting = submission.type === "submitting"
  const fieldA11yProps = (field: string) =>
    invalidFields.includes(field)
      ? { "aria-invalid": true, "aria-describedby": STATUS_ID }
      : {}

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <label className={styles.field} htmlFor="contact-name">
          <span>{t("nameLabel")}</span>
          <input
            id="contact-name"
            name="name"
            {...fieldA11yProps("name")}
            type="text"
            value={values.name}
            onChange={handleChange}
            placeholder={t("namePlaceholder")}
            autoComplete="name"
            required
          />
        </label>

        <label className={styles.field} htmlFor="contact-phone">
          <span>{t("phoneLabel")}</span>
          <input
            id="contact-phone"
            name="phone"
            {...fieldA11yProps("phone")}
            type="tel"
            value={values.phone}
            onChange={handleChange}
            placeholder={t("phonePlaceholder")}
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            required
          />
        </label>
      </div>

      <label className={styles.field} htmlFor="contact-preferred-time">
        <span>{t("preferredTimeLabel")}</span>
        <select
          id="contact-preferred-time"
          name="preferredTime"
          {...fieldA11yProps("preferredTime")}
          value={values.preferredTime}
          onChange={handleChange}
          required
        >
          {PREFERRED_TIME_OPTION_IDS.map((id) => (
            <option key={id} value={id}>
              {t(`preferredTimeOptions.${id}`)}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field} htmlFor="contact-message">
        <span>{t("messageLabel")}</span>
        <textarea
          id="contact-message"
          name="message"
          {...fieldA11yProps("message")}
          value={values.message}
          onChange={handleChange}
          placeholder={t("messagePlaceholder")}
          rows={5}
          required
        />
      </label>

      <div className={styles.honeypotField} aria-hidden="true">
        <label htmlFor="contact-website">{t("honeypotLabel")}</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          value={values.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("submittingLabel") : t("submitLabel")}
      </button>

      {/* Duty to inform under the Privacy Protection Law (.plan/026). */}
      <p className={styles.privacyNotice}>
        {t.rich("privacyNotice", {
          link: (chunks) => <Link href="/privacy">{chunks}</Link>,
        })}
      </p>

      <p
        id={STATUS_ID}
        className={`${styles.status} ${
          submission.type === "error" ? styles.statusError : ""
        }`}
        role={submission.type === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {submission.message}
      </p>
    </form>
  )
}
