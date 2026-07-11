# Style Rules

## Purpose
- Define CSS organization and maintainable styling patterns.

## CSS Structure
- In the Next.js frontend, keep `frontend/src/app/globals.css` as the global stylesheet
  imported by the root layout.
- Keep component-specific styles in colocated `*.module.css` files.
- Do not use Tailwind CSS or inline style objects for application styling.

## Authoring Rules
- Prefer CSS variables for colors, spacing, sizing, and shared tokens.
- Keep styles clean, scoped, and maintainable.
- Use nested CSS where it improves scoping and readability.
