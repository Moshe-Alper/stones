// Stable ids for the <select> value and server-side validation — display labels
// are locale-dependent and live in messages/{locale}.json under ContactForm.preferredTimeOptions.
export const PREFERRED_TIME_OPTION_IDS = ["morning", "midday", "afternoon"] as const
export type PreferredTimeOptionId = (typeof PREFERRED_TIME_OPTION_IDS)[number]

function isPreferredTimeOptionId(value: string): value is PreferredTimeOptionId {
  return (PREFERRED_TIME_OPTION_IDS as readonly string[]).includes(value)
}

export { isPreferredTimeOptionId }

// Hebrew labels for the business-facing notification email only — the owner reads
// Hebrew regardless of which language the visitor used the site in (see .plan/017).
const PREFERRED_TIME_LABELS_HE: Record<PreferredTimeOptionId, string> = {
  morning: "בוקר (08:00 - 12:00)",
  midday: "צהריים (12:00 - 15:00)",
  afternoon: "אחר הצהריים (15:00 - 17:30)",
}

export function getPreferredTimeLabelHe(id: string): string {
  return isPreferredTimeOptionId(id) ? PREFERRED_TIME_LABELS_HE[id] : id
}

const MAP_QUERY = "בית העלמין דרך השדה פרדס חנה כרכור"
const ENCODED_MAP_QUERY = encodeURIComponent(MAP_QUERY)
const MAP_PLACE_ID = "ChIJK_2MvlsOHRURHMf7uFqyo1A"

// Address, phone, email, and the map query stay in Hebrew on every locale — they
// need to resolve correctly with Israeli map services regardless of the visitor's
// reading language (see .plan/017 "Decisions confirmed with the owner").
export const CONTACT_DETAILS = {
  addressLine: "דרך השדה, צמוד לבית העלמין, פרדס חנה-כרכור",
  directPhone: "050-5282431",
  phoneHref: "tel:+972505282431",
  whatsappHref: "https://wa.me/972505282431",
  email: "moshe@alper-marble.co.il",
  mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${ENCODED_MAP_QUERY}&destination_place_id=${MAP_PLACE_ID}`,
  mapsEmbedUrl: `https://www.google.com/maps?q=${ENCODED_MAP_QUERY}&output=embed`,
  wazeUrl: `https://waze.com/ul?q=${ENCODED_MAP_QUERY}&navigate=yes`,
} as const

// TODO(owner): 3002 is a deliberately wrong placeholder so it stands out on the live
// site until Moshik supplies the real founding year (.plan/020, question 3).
export const BUSINESS_FOUNDED_YEAR = 3002

export type ContactInquiry = {
  name: string
  phone: string
  preferredTime: string
  message: string
  /** Honeypot: must stay empty. Filled in only by bots, never by real visitors. */
  website: string
}
