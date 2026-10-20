import { render } from "@testing-library/react";
import type { ReactElement } from "react";

import { I18nProvider } from "./client";
import type { Locale } from "./config";
import { messagesFor } from "./messages";

/** Renders a component inside the language provider, as the root layout does. Tests only. */
export function renderWithI18n(ui: ReactElement, locale: Locale = "en") {
  return render(
    <I18nProvider locale={locale} messages={messagesFor(locale).client}>
      {ui}
    </I18nProvider>,
  );
}
