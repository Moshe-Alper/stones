export const PREFERRED_TIME_OPTIONS = [
  "בוקר (08:00 - 12:00)",
  "צהריים (12:00 - 15:00)",
  "אחר הצהריים (15:00 - 17:30)",
] as const

const MAP_QUERY = "בית העלמין דרך השדה פרדס חנה כרכור"
const ENCODED_MAP_QUERY = encodeURIComponent(MAP_QUERY)
const MAP_PLACE_ID = "ChIJK_2MvlsOHRURHMf7uFqyo1A"

export const CONTACT_DETAILS = {
  addressLine: "דרך השדה, צמוד לבית העלמין, פרדס חנה-כרכור",
  directPhone: "03-555-8291",
  phoneHref: "tel:+97235558291",
  email: "moshe@alper-marble.co.il",
  hours: "פתוח בין השעות 08:30 - 17:30",
  studioLabel: "סטודיו ובית מלאכה",
  mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${ENCODED_MAP_QUERY}&destination_place_id=${MAP_PLACE_ID}`,
  mapsEmbedUrl: `https://www.google.com/maps?q=${ENCODED_MAP_QUERY}&output=embed`,
  wazeUrl: `https://waze.com/ul?q=${ENCODED_MAP_QUERY}&navigate=yes`,
} as const

export const SERVICE_AREA = {
  towns: ["פרדס חנה-כרכור", "חדרה", "עין שמר", "ישובי אלונה"],
  summary: "פועלים באזור פרדס חנה-כרכור, חדרה, עין שמר וישובי אלונה וסביבתן",
} as const

export type ContactInquiry = {
  name: string
  phone: string
  preferredTime: string
  message: string
  /** Honeypot: must stay empty. Filled in only by bots, never by real visitors. */
  website: string
}
