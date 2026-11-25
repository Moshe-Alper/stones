export type FactoryPhotoId = "front" | "truck" | "crane" | "forklift" | "cutter" | "tools" | "finished"

export type FactoryPhoto = {
  id: FactoryPhotoId
  // File name under public/images/factory/. Leave unset until the owner supplies
  // the real photo; the UI shows a captioned placeholder instead (see .plan/022 Q9).
  file?: string
}

// Hero background: the front of the factory with its sign.
export const HERO_PHOTO: FactoryPhoto = { id: "front" }

// "המפעל שלנו" homepage strip, in display order. Captions/alt text live in
// messages/{locale}.json under "OurFactory.photos.<id>".
export const FACTORY_PHOTOS: FactoryPhoto[] = [
  { id: "truck" },
  { id: "crane" },
  { id: "forklift" },
  { id: "cutter" },
  { id: "tools" },
  { id: "finished" },
]

export function getFactoryPhotoSrc(photo: FactoryPhoto): string | null {
  return photo.file ? `/images/factory/${photo.file}` : null
}
