export const PREFERRED_TIME_OPTIONS = [
  "בוקר (08:00 - 12:00)",
  "צהריים (12:00 - 15:00)",
  "אחר הצהריים (15:00 - 17:30)",
] as const

export const CONTACT_DETAILS = {
  addressLine: 'רחוב החרש 12, אזה"ת חולון',
  directPhone: "03-555-8291",
  phoneHref: "tel:+97235558291",
  email: "dovalper16@gmail.com",
  hours: "פתוח בין השעות 08:30 - 17:30",
  studioLabel: "סטודיו ובית מלאכה",
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=%D7%A8%D7%97%D7%95%D7%91%20%D7%94%D7%97%D7%A8%D7%A9%2012%20%D7%97%D7%95%D7%9C%D7%95%D7%9F",
} as const

export type ContactInquiry = {
  name: string
  phone: string
  preferredTime: string
  message: string
}
