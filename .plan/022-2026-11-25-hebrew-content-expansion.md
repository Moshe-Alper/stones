# 022 — Hebrew Content Expansion (ideas from competitor sites)

Status: active
Owner: Moshik Alper
Last updated: 2026-11-25

## Goal
Add Hebrew content that helps families decide and builds trust, and that also improves search visibility. The ideas come from how two competitor sites use text. We take only the content types and themes, never their wording. Translation to EN/RU comes later in a separate plan.

## Research Summary (what the competitors focus on)

**borkinmazevot.co.il (Hadera)**: a site with a lot of content.
- Family story and founding year as the main trust signal ("generations of artists").
- Four value pillars: discreet service, professionalism, materials, meeting deadlines.
- Headstone *types* page (single, double, multi-plot, half-stone, "Sanhedrin"/niche, with photo, add-ons).
- Materials guide: Hebron, granite, Turkish, natural rock, Halila stone. For each one: origin, durability, maintenance, price level.
- 9 articles: unveiling ceremony (גילוי מצבה), couple headstones, memorial plaques, burial methods in Israel, stone sculpture, add-ons, materials.
- Testimonials page (about 15 reviews from Midrag). The themes are patience, transparent pricing, deadlines, and photos sent after installation.
- Press page, monuments page.
- Lead form on every page.

**rahamimmatzevot.com (Or Akiva)**: a thin site that is mostly SEO.
- Headline: "over 50 years of experience" plus personal guidance.
- One page per material (basalt, black granite, Sardo, Ruby red, Hebron, Turkish…). Each has the same pattern: short intro → "why this stone" → "combining stones" → finish types (e.g. sandblast) → gallery → quote form.
- The list of towns it serves is in the page `<title>`.
- "Free consultation" WhatsApp CTA everywhere.

**What neither site has, and where we can stand out:** clear practical guidance for the family (what happens, when, and what we take care of), cemetery-adjacent workshop, and the "what's included in the price" honesty we already show.

## Scope
In scope (Hebrew only, `frontend/messages/he.json`, existing pages only):
1. **Per-material text on catalog category pages** (`/catalog/[slug]`). Add 3–4 short blocks per stone: what it is, why choose it, maintenance, combinations/finishes. This follows the Rahamim SEO pattern and uses routes we already have.
2. ~~Headstone types section~~ dropped: owner says everything offered is already on the site (Q2).
3. **Testimonials block** on an existing page with *real* reviews supplied by the owner. Nothing invented.
4. **FAQ additions** (contact page): how long production takes, when it is customary to install, whether families can visit the workshop and see stones, and how payment works.
5. **SEO metadata**: towns we serve in page titles and descriptions, and a per-material description for each category page.

### Owner requests (2026-11-25)
6. **Homepage hero photo**: replace the current headstone photo with the **front of the business, with its sign**. No photo exists yet, so use a labeled placeholder until the owner supplies one.
7. **More business photos** (placeholders for now), to show a real working factory:
   - Inside the factory: truck, crane, forklift, cutting machine, various tools.
   - Finished headstones in the factory, ready for installation.
   Placement: see Q6.
8. **FAQ removals** (contact page):
   - Remove "מה כלול במחיר?" (`FAQ.q4`).
   - Remove "האם אתם מטפלים גם באישורים מול בית העלמין?" (`FAQ.q2`).
9. **FAQ "אילו סוגי אבן מומלצים…"** (`FAQ.q3`): rewrite the answer so it recommends **granite, marble, and Galilean dolomite rocks** (סלעי דולמיט גליליים).
10. **"The Pardes Hanna business" positioning**: the brand line becomes "שיש אלפר – מובילים את תרבות ההנצחה באזור פרדס חנה-כרכור והסביבה". Add that **the factory and offices are in Pardes Hanna**. Apply it in `Metadata.description`, `Footer.brandBlurb` and `FAQ.q1AnswerTemplate`. Consider "studio" → "factory" wording (Q7).

Out of scope:
- **New pages** (owner decision 2026-11-25). This includes an about page, a guides/blog section, a press page and a monuments page. The guide topics (funeral → headstone timeline, choosing an inscription, stone comparison) can feed FAQ answers or the category texts instead.
- Adding long text to the homepage. Plan 020 made the homepage image-first on purpose. The only homepage changes are the photos and the brand line (items 6, 7, 10).
- EN/RU translation (follow-up plan).
- Re-adding FAQ items that plan 018 removed on purpose: warranty, additional inscription on an existing headstone, restoration.

## Assumptions
- All copy is written fresh. No sentences are copied from competitor sites.
- Owner reviews every text before it goes live, especially religious/halachic statements.
- Until translated, the new EN/RU message keys reuse the Hebrew text or are hidden. This is decided in the translation plan.
- Tone: warm, restrained, family. No sales language ("יוקרתי", "הכי זול").

## Open Questions
Answer inline. Each question has a recommended answer.

1. **Which items to do first?**
   Recommended: (1) per-material text, (2) FAQ additions. These need the fewest facts from you. SEO metadata and testimonials come in a second round.
   Answer (2026-11-25): Claude's call. Order: (a) owner requests, text part (FAQ removals, stone answer, Pardes Hanna line, "מפעל ומשרדים"); (b) hero + "המפעל שלנו" photo placeholders; (c) per-material text; (d) SEO metadata. FAQ additions and testimonials wait for Q4/Q5.

2. **Which headstone types do you offer?** Single / double (couple) / multi-plot / half / Sanhedrin-niche / headstone with photo / add-ons (vase, candle niche, bench, plaque).
   Recommended: list only what you actually make.
   Answer (2026-11-25): Everything we make is already on the site. No headstone types section is needed.

3. **Which materials get their own text?** Current categories are Hebron, Turkish, granite and special. Do you also work with basalt or natural rock enough to mention them?
   Recommended: write text for the 4 existing categories only.
   Answer (2026-11-25): Write text for all of them (Hebron, Turkish, granite, special incl. Galilean dolomite).

4. **Testimonials**: do you have real reviews (Google, Midrag, WhatsApp messages with permission)? Show first names only?
   Recommended: 5–8 short reviews, first name + town, collected from Google reviews.
   Answer (2026-11-25): Deferred. Leave empty for now; testimonials block is on hold.

5. **Facts for FAQ answers**: typical production time, typical timing of installation, can families visit the workshop, payment terms.
   Recommended: you give the facts, I write the copy.
   Answer (2026-11-25): Deferred. Leave empty for now; FAQ additions are on hold.

6. **Where do the factory and finished-headstone photos go?**
   Recommended: a new homepage strip, "המפעל שלנו", with 6 photos (truck, crane, forklift, cutting machine, tools, finished headstones), placed after "עבודות אחרונות". The contact page's workshop photo also becomes a factory photo.
   Answer (2026-11-25): Go with the recommendation.

7. **Wording "סטודיו" → "מפעל"?** The contact page says "כתובת הסטודיו" and "סטודיו ובית מלאכה", and the FAQ says "הסטודיו ובית המלאכה… צמוד לבית העלמין". Change these to "המפעל והמשרדים"? Keep "צמוד לבית העלמין"?
   Recommended: yes to "מפעל ומשרדים" everywhere. Keep "צמוד לבית העלמין" only if it is accurate.
   Answer (2026-11-25): Yes, replace "סטודיו" with "מפעל ומשרדים" across the whole site. "צמוד לבית העלמין" is accurate, so keep it.

8. **Galilean dolomite**: is it part of the "מצבות מיוחדות" category, or does it need its own catalog category?
   Recommended: mention it in the "מצבות מיוחדות" text for now. No new category.
   Answer (2026-11-25): Go with the recommendation for now.

9. **Placeholder look**: until real photos arrive, show grey boxes with a caption saying what photo belongs there (e.g. "חזית המפעל עם השלט")? That gives you a shot list.
   Recommended: yes, but only in Preview. In production, keep the current photos until the real ones arrive, so the live site never shows empty boxes.
   Answer (2026-11-25): Captioned grey boxes are OK. The owner may decide to show them on the live site too. Decide this at merge time, after the Preview review.

## Hebrew Copy Draft (for owner review)
Fresh wording, not taken from competitor sites. Edit freely. Mark anything inaccurate.

### Brand line (`Footer.brandBlurb`, `Metadata.description`)
> שיש אלפר – מובילים את תרבות ההנצחה באזור פרדס חנה-כרכור והסביבה. המפעל והמשרדים שלנו ממוקמים בפרדס חנה, צמוד לבית העלמין.

### FAQ q1 – "באילו אזורים אתם פעילים?"
> {summary}. אנחנו העסק של פרדס חנה: המפעל והמשרדים שלנו נמצאים כאן, צמוד לבית העלמין.

### FAQ q3 – "אילו סוגי אבן מומלצים לתנאי מזג האוויר בישראל?"
> אנו ממליצים על גרניט, שיש וסלעי דולמיט גליליים. אלה אבנים קשות שעומדות היטב בחום, בגשם ובשמש הישראלית לאורך שנים. נשמח להראות לכם את האפשרויות במפעל ולהתאים את האבן לטעם ולתקציב.

### Wording replacements ("סטודיו" → "מפעל")
| Key | Today | New |
|---|---|---|
| `ContactDetails.addressCardLabel` | כתובת הסטודיו | כתובת המפעל |
| `ContactMap.studioLabel` | סטודיו ובית מלאכה | מפעל ומשרדים |
| `ContactMap.sectionAriaLabel` / `mapTitle` / `mapFallbackAriaLabel` | מיקום / מפת מיקום הסטודיו | מיקום / מפת מיקום המפעל |
| `ContactMap.navigateAriaLabel` / `wazeAriaLabel` | ניווט לסטודיו… | ניווט למפעל… |
| `ContactMap.workshopLabel` | בית המלאכה המשפחתי | המפעל המשפחתי |

### Homepage strip "המפעל שלנו" (placeholder captions = shot list)
Heading: **המפעל שלנו בפרדס חנה**. Sub-line: **כל מצבה נבנית אצלנו, מהאבן הגולמית ועד ההצבה.**
1. חזית המפעל עם השלט (also the new hero photo)
2. משאית המפעל
3. מנוף בעבודה
4. מלגזה מעמיסה אבן
5. מכונת חיתוך אבן
6. כלי עבודה וחריטה
7. מצבות מוכנות לפני הצבה

### Per-material text (`/catalog/[slug]`, below the gallery)
**שיש חברוני**
- *מה זו האבן:* אבן גיר מהרי חברון, בגוון בהיר וחם. זו האבן הנפוצה ביותר בבתי העלמין בארץ.
- *למה לבחור בה:* מראה מסורתי ומוכר, נוחה לעיבוד ולחריטה, ומחירה נוח יחסית.
- *תחזוקה:* ניקוי מדי פעם במים ובמברשת רכה. אין צורך בחומרים מיוחדים.
- *שילובים:* משתלבת יפה עם גרניט כהה, חלוקי נחל ואותיות בולטות.

**שיש טורקי**
- *מה זו האבן:* שיש לבן-אפרפר בעל עורקים עדינים, מיובא מטורקיה.
- *למה לבחור בה:* מראה נקי ואלגנטי שנשמר לאורך שנים.
- *תחזוקה:* ניקוי עדין ושוטף, כדי למנוע כתמים מעלים ואבק.
- *שילובים:* מתאים לעיצוב קלאסי, לבד או בשילוב מסגרת גרניט.

**גרניט**
- *מה זו האבן:* אבן קשה מאוד, במבחר צבעים: שחור, אפור, אדום וכחול.
- *למה לבחור בה:* עמידות גבוהה במיוחד לשמש ולגשם. הליטוש והצבע נשמרים, והכיתוב נשאר קריא.
- *תחזוקה:* כמעט ללא תחזוקה; ניקוי במים מספיק.
- *שילובים:* אפשר לשלב כמה גווני גרניט, או גרניט עם שיש חברוני, ליצירת ניגוד.

**מצבות מיוחדות**
- *מה זה:* מצבות בעיצוב אישי: אבני לקט, סלעי דולמיט גליליים, פיסול ועיבודים אמנותיים.
- *למה לבחור:* כשרוצים מצבה שמספרת משהו על האדם, ושונה מהמקובל.
- *איך זה עובד:* נשב יחד, נשמע על יקירכם ונציע עיצוב. רק אחרי שתאשרו נתחיל לעבוד.
- *חומרים:* סלע טבעי, דולמיט גלילי ושילובים עם שיש וגרניט, לפי העיצוב.

## Steps
1. Collect answers to the Open Questions.
2. Write a Hebrew copy draft for the chosen items in this plan (or a linked draft file) for owner review *before* any code.
3. Per-material blocks: add keys under `Categories.<slug>` in `frontend/messages/he.json`, render them on `/catalog/[slug]` below the gallery.
4. FAQ additions in the `FAQ` namespace.
5. Testimonials block, once real reviews have been supplied.
6. Per-page `generateMetadata` titles and descriptions that include the towns we serve.
7. Update `.doc/glossary.md` if new terms appear.

## Validation
- Owner approves all Hebrew copy before merge.
- Spot-check against competitor sites: no copied sentences.
- `npm run build` and unit tests pass.
- Vercel Preview checked on mobile (RTL layout, readable length, no horizontal scroll).
- EN/RU pages show no broken message keys.

## Risks
- **Too much text again**: mitigated by keeping the homepage untouched and blocks short (2–3 sentences each).
- **Halachic or custom inaccuracies** in FAQ answers: owner (or a rabbi) reviews before publishing.
- **Invented trust claims**: only facts the owner confirms; no fake reviews.
- **Missing translations** break EN/RU: every new Hebrew key needs an EN/RU entry, even a placeholder.

## Rollout Order
0. Owner requests: FAQ removals, stone-types answer, Pardes Hanna brand line (quick text PR). Then hero + factory photo placeholders, swapped for real photos when supplied.
1. Per-material text + FAQ additions (one PR).
2. SEO metadata (one PR).
3. Testimonials, once reviews have been collected.
4. Follow-up plan: EN/RU translation of everything above.

## Rollback
Each round is a separate PR. Revert the PR, or remove the new message keys. No data, route or schema changes are involved.

## Implementation Notes (2026-11-25)
Owner said: "put in what you wrote for now; we'll fix later if needed". Done on branch `feat/hebrew-content-022` (from `origin/main`):
- Rounds (a)–(c) done: FAQ trimmed to 2 (removed pricing + cemetery approvals; old `q3` renumbered to `q2`), stone recommendation answer, Pardes Hana brand line (footer + meta description; "over 60 years" dropped from those two lines per owner's wording), "סטודיו" → "מפעל" on the contact page, hero + "המפעל שלנו" placeholders, 4 "about this stone" blocks on each category page.
- The contact-page workshop photo from Q6 no longer exists (removed in plan 021), so nothing to replace there.
- To add a real photo: put it in `frontend/public/images/factory/` and set `file` on its entry in `frontend/src/data/factory-photos.ts`.
- EN/RU got matching translations of all new keys (Claude's draft, to review with the translation plan).
- Round (d) SEO metadata: not started.
- Validation: 101 unit tests, lint, build and all 25 Playwright e2e tests pass; mobile/desktop screenshots checked, no horizontal scroll.
