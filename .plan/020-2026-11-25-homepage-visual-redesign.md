# 020 – עיצוב מחדש של דף הבית: פחות טקסט, יותר תמונות

Status: active
Owner: Moshik Alper
Last updated: 2026-11-25

סקיצה מאושרת כבסיס: https://claude.ai/artifact/KfMzV6c8Bm2B5fjWck3v5X

## Goal

דף הבית מרגיש עמוס בטקסט ומציג מעט תמונות, למרות שיש 48 תמונות אמיתיות בגלריה.
המטרה: שמבקר יראה עבודות אמיתיות כבר במסך הראשון, ושכל מסך יכיל לכל היותר כ-3 שורות טקסט רצופות.
מסלול ההמרה המרכזי (קטלוג ← גלריה ← יצירת קשר) נשאר, אבל עם פחות קליקים ופחות קריאה.

## Scope

בתוך התוכנית (דף הבית בלבד, בכל 3 השפות he/en/ru):

1. **Hero** – תמונה אמיתית מהגלריה (`gallery-88.jpg`) במקום `hero-workshop.webp` (סטוק).
   כותרת: "מצבות בעבודת יד, לזכר יקיריכם". בלי פסקת משנה.
   כפתורים: "לצפייה בעבודות" (← `#works`) ו"דברו איתנו" (← `/contact`).
2. **עבודות אחרונות** (רכיב חדש `RecentWork`) – רשת של 8 תמונות בגדלים מעורבים (חלקן רחבות/גבוהות),
   בלי טקסט, עם קישור "לכל הגלריה ←" לקטלוג. 4 עמודות במחשב, 2 בנייד.
3. **בחרו סוג אבן** (מחליף את `MaterialsGrid`) – 4 אריחי תמונה לחיצים (חברוני, טורקי, גרניט, מיוחדות),
   על כל אריח רק השם; תג "הכי מבוקש" על שיש חברוני. מקשר ל-`/catalog/<slug>`.
   הפסקה שחוזרת 3 פעמים נמחקת.
4. **איך זה עובד** (`ProcessSteps` מקוצר) – שורה אחת, 4 שלבים, מספר + 2–3 מילים לכל שלב. בלי פסקאות.
5. **עסק משפחתי** (רכיב חדש `FamilyNote`) – שורה קטנה "עסק משפחתי מאז 3002" (פלייסהולדר מכוון, ראה שאלה 3) + משפט אחד. בלי תמונה.
6. **פס יצירת קשר** (רכיב חדש `ContactBand`) – טלפון ווואטסאפ 050-5282431, קישור "השאירו פרטים" ל-`/contact`,
   ושורת אזור שירות. מחליף את `ServiceArea` בראש הדף.
7. **שאלות נפוצות** – יוצאות מדף הבית ועוברות לעמוד יצירת הקשר; קישור התפריט מתעדכן.
8. **כפתור וואטסאפ צף** בנייד (רכיב `WhatsAppFab`), בכל העמודים.

מחוץ לתוכנית: עמוד הקטלוג, עמוד הקטגוריה, עמוד יצירת קשר (שלב הבא, תוכנית נפרדת); תמונות חדשות.

## Assumptions

- העבודה נבנית על הענף `fix/header-build-error`, שם נמצאים תרגומי next-intl (`a3b1952`)
  ותיקוני התוכן (`fadf1c0`, `b4762cd`, `0c4e23f`). הענף הזה **עדיין לא מוזג ל-`main`**, ולכן האתר החי וה-`main` לא כוללים אותם.
- מספר הטלפון 050-5282431 כבר מוגדר ב-`frontend/src/data/contact.ts` בענף הזה; וואטסאפ ישתמש באותו מספר (`https://wa.me/972505282431`).
- עיצוב, צבעים וגופנים נשארים לפי `frontend/src/app/globals.css` ו-`.rule/style-rules.md` (Frank Ruhl Libre + Heebo, צבע זהב `#725b27`).
- התמונות לגלריית "עבודות אחרונות" ולאריחים נלקחות מ-`frontend/src/data/gallery.ts`, כך שתמונות חדשות שיתווספו בהמשך יופיעו אוטומטית.
- תרגומי en/ru לטקסטים החדשים ייכתבו על ידי, ויחכו לבדיקה של משה (כמו בתוכנית 017).

## Open Questions

1. **בסיס העבודה:** למזג קודם את `fix/header-build-error` ל-`main` (PR נפרד), ורק אחר כך להתחיל ענף חדש לעיצוב?
   - המלצה: **כן, למזג קודם.** אחרת העיצוב החדש ייבנה על קוד ישן ויהיו קונפליקטים בכל קובץ תרגום.
   - תשובה: **כן** – ממזגים קודם (2026-11-25).
2. **שאלות נפוצות:** להוריד לגמרי מדף הבית, או להשאיר 3 שאלות + קישור "לכל השאלות"?
   - המלצה: **להוריד מדף הבית ולהעביר לעמוד יצירת הקשר** (שם מי שמתלבט מחפש תשובות). קישור "שאלות נפוצות" בתפריט יפנה לשם.
   - תשובה: **מסכים** – שאלות נפוצות עוברות לעמוד יצירת הקשר.
3. **שנת הקמה:** בינתיים `[שנה]` כפלייסהולדר. להשאיר את כל השורה מוסתרת עד שתהיה שנה אמיתית, או להציג עם פלייסהולדר?
   - המלצה: **להציג רק "עסק משפחתי"** בלי שנה עד שתמסור אותה – פלייסהולדר גלוי באתר חי לא נראה טוב.
   - תשובה: **להציג "עסק משפחתי מאז 3002"** – שנה שגויה בכוונה כתזכורת למשה להחליף. ⚠️ חובה להחליף לפני/מיד אחרי עלייה לאוויר.
4. **אילו 8 תמונות בגלריית "עבודות אחרונות"?** קבועות (בחירה ידנית) או 8 האחרונות שנוספו ל-`gallery.ts`?
   - המלצה: **שדה `featured: true` ב-`gallery.ts`** – אתה בוחר, וקל להחליף.
   - תשובה: **לפי בחירת Claude בינתיים** – משה יחליף אחר כך דרך `featured` ב-`gallery.ts`.
5. **כפתור וואטסאפ צף בנייד** (פינה תחתונה, תמיד גלוי)?
   - המלצה: **כן** – רוב הפניות מגיעות מטלפון.
   - תשובה: **כן** – כפתור וואטסאפ צף בנייד.

## Steps

1. מיזוג `fix/header-build-error` ל-`main`; ענף חדש `feat/homepage-visual-redesign`.
2. `gallery.ts`: הוספת `featured` לתמונות הנבחרות + פונקציה `getFeaturedPhotos()` (עם בדיקה ב-`gallery.test.ts`).
3. `Hero`: החלפת התמונה, הסרת subheading, עדכון כפתורים ומפתחות ב-`messages/{he,en,ru}.json`.
4. רכיב `RecentWork` חדש (רשת תמונות + קישור לגלריה) + בדיקת יחידה.
5. `MaterialsGrid` → `CategoryTiles`: 4 אריחים מ-`CATEGORIES` + `getCategoryThumbnail`, תג "הכי מבוקש", הסרת `excerpt`.
6. `ProcessSteps`: הסרת `intro` ו-`stepNDesc`, פריסה בשורה אחת.
7. רכיבים `FamilyNote`, `ContactBand` (טלפון, וואטסאפ, קישור לטופס, אזור שירות) ו-`WhatsAppFab` (נייד בלבד, ב-`[locale]/layout.tsx`).
8. `FAQ`: העברה לעמוד יצירת קשר, עדכון קישור בתפריט ל-`/contact#faq`.
9. `[locale]/page.tsx`: סדר חדש – Hero, RecentWork, CategoryTiles, ProcessSteps, FamilyNote, ContactBand.
10. ניקוי: מחיקת מפתחות תרגום שלא בשימוש; מחיקת `hero-workshop.webp` ו-`material-*.webp` אם אין בהם שימוש נוסף (כולל `CREDITS.md`).
11. עדכון `.doc/architecture.md` (רשימת רכיבי דף הבית) ו-`.doc/glossary.md` אם נוספו מונחים.

## Validation

- `npm run lint`, `npm test` (Vitest) עוברים; בדיקות יחידה לרכיבים החדשים ולמחיקת הרכיבים הישנים.
- `frontend/e2e/homepage.spec.ts` מעודכן לכפתורים ולעוגנים החדשים (הבדיקה הנוכחית מחפשת "לצפייה בקטלוג" ו"סיפור המותג" – שניהם משתנים).
- בדיקה ידנית ב-`npm run dev` ב-3 שפות, ברוחב מחשב (1440) ובנייד (390): בלי גלילה אופקית, תמונות לא מעוותות.
- Lighthouse על דף הבית: LCP לא מחמיר לעומת היום (תמונת ה-Hero עם `preload`, שאר התמונות `lazy`).
- Preview ב-Vercel לפני מיזוג, לבדיקה שלך בטלפון.

## Risks

- **שנת 3002 באוויר:** פלייסהולדר מכוון שעלול להישכח. לסמן ב-TODO בקוד ולהזכיר בכל עדכון סטטוס עד שמוחלף.

- **ענף לא ממוזג:** אם מתחילים מ-`main` נאבד את התרגומים ותיקוני התוכן. מנוטרל ע"י שלב 1.
- **משקל הדף:** 13 תמונות במקום 4 – תלוי ב-`next/image` עם `sizes` נכונים ו-lazy loading.
- **איכות התמונות:** תמונות טלפון עם טשטוש שמות; חלקן פחות מחמיאות בגודל מלא. בחירת `featured` ידנית מפחיתה את זה.
- **בדיקות e2e:** חבילת Playwright כבר שבורה בגלל זיהוי שפה (מתוכנית 017) – צריך לתקן או לסמן בנפרד.

## Rollout Order

1. מיזוג הענף הקיים ל-`main` ופריסה (בלי שינוי עיצוב).
2. ענף העיצוב → Preview ב-Vercel → אישור שלך.
3. מיזוג ל-`main` → פריסה אוטומטית ל-alper-marble.co.il.
4. תוכנית המשך: קטלוג/גלריה ויצירת קשר באותו סגנון.

## Rollback

- revert של קומיט המיזוג ב-`main` → Vercel פורס מחדש את הגרסה הקודמת. אין שינויי DB או API.
- לחלופין "Promote" לפריסה הקודמת בלוח הבקרה של Vercel.

## Implementation Notes (2026-11-25)

- Step 1 done locally: `fix/header-build-error` merged into `main` (merge commit `9fd404d`, not pushed). Unit tests, `tsc`, `eslint` green after merge.
- Steps 2–11 implemented on branch `feat/homepage-visual-redesign` (uncommitted, awaiting owner review).
- Featured photos (Claude's pick, owner to adjust): `gallery-72`, `73`, `86`, `24`, `84`, `64`, `59`, `75`. Hero: `gallery-88`.
- Category tiles use each category's first gallery photo (`getCategoryThumbnail`), same as the catalog page.
- `lucide-react` added for the phone/WhatsApp icons (per `.rule/ui-rules.md`).
- Removed unused stock images `hero-workshop.webp`, `material-*.webp` and their `CREDITS.md` rows.
- Playwright: pinned `locale: "he-IL"` — fixes the locale-negotiation break from 017. Homepage e2e: all pass.
  Still failing and **not caused by this change** (same failures on `main`): `e2e/contact.spec.ts` (4, stale heading
  "ייעוץ אישי מהמשפחה שלנו" vs current "ייעוץ אישי ומקצועי") and `e2e/product.spec.ts` (7, the product route was
  removed in `e7efc9f`). Proposed as a separate cleanup.
- Footer blurb still says "למעלה מ-50 שנה" — conflicts with the 3002 placeholder until the real year is set.

## Follow-up (2026-11-25, after PR #4 went live)

- Founding year set to **1965** (owner). "Over 50 years" in the footer/meta description updated to "over 60 years" in all locales to match.
- EN/RU translation review by Claude (owner delegated the review): fixed awkward/literal phrasing ("leading the culture of memorialization"), RU style filters (`Модерн` means Art Nouveau → `Современный`), RU "Вечер" for 15:00–17:30 → "После обеда", unified the "most popular" badge wording, unified the RU family-name spelling to "Альпер", gentler EN wording for the special-headstones description.
