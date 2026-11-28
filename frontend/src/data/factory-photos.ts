export type FactoryPhotoId = "front" | "truck" | "crane" | "forklift" | "cutter" | "tools" | "finished"

export type FactoryPhoto = {
  id: FactoryPhotoId
  // File name under public/images/factory/. Leave unset until the owner supplies
  // the real photo; the UI shows a captioned placeholder instead (see .plan/022 Q9).
  file?: string
}

// Hero background: meant to be the front of the factory with its sign. TEMPORARY: until
// the owner hangs the sign and shoots it, the hero reuses the factory-yard photo. When the
// sign photo arrives, set its file here and restore "Hero.imageAlt" in messages.
export const HERO_PHOTO: FactoryPhoto = { id: "front", file: "factory-yard.jpg" }

// "המפעל שלנו" homepage strip, in display order. Captions/alt text live in
// messages/{locale}.json under "OurFactory.photos.<id>".
export const FACTORY_PHOTOS: FactoryPhoto[] = [
  { id: "truck", file: "factory-yard.jpg" },
  { id: "crane" },
  { id: "forklift" },
  { id: "cutter" },
  { id: "tools", file: "carving-detail.webp" },
  { id: "finished" },
]

// About page (.plan/025): the story section shows the factory yard and the craft section
// the hand-carving photo, so the factory strip there leaves these out.
export const ABOUT_STORY_PHOTO_ID: FactoryPhotoId = "truck"
export const ABOUT_CRAFT_PHOTO_ID: FactoryPhotoId = "tools"

export function getFactoryPhoto(id: FactoryPhotoId): FactoryPhoto | undefined {
  return FACTORY_PHOTOS.find((photo) => photo.id === id)
}

export function getFactoryPhotoSrc(photo: FactoryPhoto): string | null {
  return photo.file ? `/images/factory/${photo.file}` : null
}
