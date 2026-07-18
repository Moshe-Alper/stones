# PRD — Matzevot (Alper Matzevot)

**Version:** 0.1
**Author:** Moshik Alper
**Figma:** https://www.figma.com/design/AUIumATzMjmGOSLtUWbzqG/stones
**Status:** Draft

---

## Overview

Matzevot is the informational website for Alper Matzevot, a family-run business that designs and produces memorial stones (matzevot/headstones). The site lets visitors browse a catalog of memorial stone designs and reach out to the business directly — there is no online ordering, cart, or payment. Its purpose is to showcase the catalog and drive inquiries by phone, email, contact form, or in-person visit.

---

## Screens

### Screen 1 — Homepage
- Introduces Alper Matzevot as a family business.
- Highlights the catalog and invites visitors to browse or get in touch.
- Entry points to Catalog and Contact pages.

### Screen 2 — Catalog page
- Grid/list of memorial stone designs available from the business.
- Each entry shows a representative photo and links to its Product Detail page.
- Optional filtering/sorting (e.g. by material or size) if useful once catalog size is known.

### Screen 3 — Product Detail page
- Displays a single memorial stone design.
- Photos of the stone.
- Material & finish (e.g. granite type, color, polish).
- Dimensions (available size options).
- Approximate price range (not final online pricing — inquiries confirm exact cost).
- Clear call-to-action to contact the business about this design.

### Screen 4 — Contact page
- Phone number.
- Email address.
- Physical address / showroom location, with a map.
- Contact form for visitors to send an inquiry.

---

## Functional Requirements

| ID | Requirement |
|----|-------------|
| F1 | Visitors can view a catalog of memorial stone designs. |
| F2 | Visitors can open a Product Detail page for any catalog entry showing photos, material/finish, dimensions, and price range. |
| F3 | Visitors can reach the business via phone, email, physical address/map, or a contact form. |
| F4 | The contact form captures visitor name, contact info, and message, and delivers it to the business (e.g. via email). |
| F5 | No cart, checkout, or online payment functionality exists anywhere on the site. |

---

## Non-Functional Requirements

- Site must be usable and legible on mobile devices, since inquiries may come from visitors at a cemetery or on the go.
- Content should be respectful and calm in tone, appropriate for a memorial/bereavement context.
- Reasonable page-load performance for image-heavy catalog and product pages.
- Accessibility: readable contrast and text sizing given a likely older visitor demographic.

---

## Acceptance Criteria

1. **AC-1:** A visitor can navigate from the Homepage to the Catalog, open a specific stone's Product Detail page, and reach the Contact page without dead ends.
2. **AC-2:** Every catalog entry has a working Product Detail page showing photos, material/finish, dimensions, and price range.
3. **AC-3:** Submitting the Contact form results in the inquiry being delivered to the business (or a clear simulated/local delivery path during development).
4. **AC-4:** No page exposes cart, checkout, or payment UI.

---

## Data Model (proposed)

```
memorial_stone
  id            uuid PK
  name          text
  photos        text[]        -- image URLs
  material      text
  finish        text
  dimensions    text          -- e.g. "24x12x4 in" or size options
  price_range   text          -- e.g. "$X - $Y", approximate

contact_inquiry
  id            uuid PK
  name          text
  email         text
  phone         text
  message       text
  created_at    timestamp
```

---

## Out of Scope (v1)
- Online ordering, cart, checkout, or payment processing.
- User accounts / login.
- Inventory or stock tracking.
