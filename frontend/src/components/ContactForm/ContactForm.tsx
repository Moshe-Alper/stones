"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { PREFERRED_TIME_OPTIONS, type ContactInquiry } from "@/data/contact"
import styles from "./ContactForm.module.css"

const INITIAL_VALUES: ContactInquiry = {
  name: "",
  phone: "",
  preferredTime: PREFERRED_TIME_OPTIONS[0],
  message: "",
}

type SubmissionState = {
  type: "idle" | "submitting" | "success" | "error"
  message: string
}

const INITIAL_SUBMISSION_STATE: SubmissionState = {
  type: "idle",
  message: "",
}

export default function ContactForm() {
  const [values, setValues] = useState<ContactInquiry>(INITIAL_VALUES)
  const [submission, setSubmission] = useState<SubmissionState>(
    INITIAL_SUBMISSION_STATE,
  )

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const field = event.target.name as keyof ContactInquiry
    setValues((current) => ({ ...current, [field]: event.target.value }))

    if (submission.type === "error") {
      setSubmission(INITIAL_SUBMISSION_STATE)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const hasMissingField = Object.values(values).some(
      (value) => !value.trim(),
    )

    if (hasMissingField) {
      setSubmission({
        type: "error",
        message: "אנא מלאו את כל השדות כדי שנוכל לחזור אליכם.",
      })
      return
    }

    setSubmission({ type: "submitting", message: "שולחים את הבקשה..." })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          payload?.error?.message ??
            "לא הצלחנו לשלוח את הבקשה. נסו שוב בעוד כמה רגעים.",
        )
      }

      setSubmission({
        type: "success",
        message: "בקשתכם נשלחה למשפחה. נחזור אליכם בהקדם.",
      })
      setValues(INITIAL_VALUES)
    } catch (error) {
      setSubmission({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "לא הצלחנו לשלוח את הבקשה. נסו שוב בעוד כמה רגעים.",
      })
    }
  }

  const isSubmitting = submission.type === "submitting"

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <label className={styles.field} htmlFor="contact-name">
          <span>שם מלא</span>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            placeholder="ישראל ישראלי"
            autoComplete="name"
            required
          />
        </label>

        <label className={styles.field} htmlFor="contact-phone">
          <span>מספר טלפון</span>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            placeholder="050-0000000"
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            required
          />
        </label>
      </div>

      <label className={styles.field} htmlFor="contact-preferred-time">
        <span>זמן מועדף ליצירת קשר</span>
        <select
          id="contact-preferred-time"
          name="preferredTime"
          value={values.preferredTime}
          onChange={handleChange}
          required
        >
          {PREFERRED_TIME_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field} htmlFor="contact-message">
        <span>הודעה / בקשה מיוחדת</span>
        <textarea
          id="contact-message"
          name="message"
          value={values.message}
          onChange={handleChange}
          placeholder="כיצד נוכל לעזור?"
          rows={5}
          required
        />
      </label>

      <button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "שולחים..." : "שליחת בקשה למשפחה"}
      </button>

      <p
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
