import type { ReactElement } from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import messages from "../../messages/he.json"

// Every component under test now calls useTranslations()/next-intl's Link, which
// requires NextIntlClientProvider context in Vitest (jsdom doesn't distinguish
// Server from Client Components the way Next's RSC runtime does — see .plan/017).
// Rendering with the real he.json messages keeps existing test assertions against
// Hebrew copy valid unchanged.
export function renderWithIntl(ui: ReactElement, options?: RenderOptions) {
  return render(
    <NextIntlClientProvider locale="he" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
    options,
  )
}
