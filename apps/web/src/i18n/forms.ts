"use client";

import { useEffect, useMemo, useRef } from "react";

import { useI18n } from "./client";
import type { ValidationMessages } from "./messages/en-validation";

/** A form schema built with validation messages in the current language. */
export function useLocalizedSchema<Schema>(schemaFor: (messages: ValidationMessages) => Schema): Schema {
  const { m } = useI18n();
  return useMemo(() => schemaFor(m.validation), [m.validation, schemaFor]);
}

/**
 * After a language switch, re-checks only the fields currently showing an
 * error so their messages appear in the new language. Values the visitor typed
 * are never changed, and untouched fields don't suddenly show errors.
 */
export function useRevalidateOnLocaleChange(trigger: (names: never[]) => unknown, errorNames: string[]) {
  const { locale } = useI18n();
  const names = useRef(errorNames);
  const previous = useRef(locale);

  useEffect(() => {
    names.current = errorNames;
  });

  useEffect(() => {
    if (previous.current === locale) return;
    previous.current = locale;
    if (names.current.length) void trigger(names.current as never[]);
  }, [locale, trigger]);
}
