import en from '../locales/en.json';
import es from '../locales/es.json';

export type Locale = 'pt-BR' | 'en' | 'es';
export type LanguagePreference = Locale | 'auto';
const storageKey = 'resell-language';
const dictionaries: Record<string, Record<string, string>> = { en, es };
const listeners = new Set<() => void>();
const sourceByTranslation = new Map<string, string>();
for (const dictionary of Object.values(dictionaries)) {
  for (const [source, translation] of Object.entries(dictionary)) {
    if (!sourceByTranslation.has(translation))
      sourceByTranslation.set(translation, source);
  }
}

export function detectLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const base = language.toLowerCase().split(/[-_]/)[0];
    if (base === 'pt') return 'pt-BR';
    if (base === 'en' || base === 'es') return base;
  }
  return 'pt-BR';
}

function readPreference(): LanguagePreference {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'pt-BR' || saved === 'en' || saved === 'es') return saved;
  } catch {
    /* Language selection also works when storage is unavailable. */
  }
  return 'auto';
}
let preference = readPreference();
let locale: Locale =
  preference === 'auto'
    ? detectLocale(
        navigator.languages.length ? navigator.languages : [navigator.language],
      )
    : preference;
export const getLocale = () => locale;
export const getLanguagePreference = () => preference;
export function subscribeLanguage(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Portuguese source strings are also the fallback catalogue. Normalize translated
// messages so validation errors already in state follow subsequent language changes.
export function t(
  source: string,
  values: Record<string, string | number> = {},
): string {
  const key = sourceByTranslation.get(source) ?? source;
  const message = dictionaries[locale]?.[key] ?? key;
  return message.replace(/\{(\w+)\}/g, (match, name: string) =>
    String(values[name] ?? match),
  );
}

function updateDocument() {
  document.documentElement.lang = locale;
  document.title = t('Resell T Project - Revenda de VPN Premium');
  const description = t(
    'Seja um revendedor VPN com qualidade premium e preços acessíveis. Painel web otimizado e app fluido com suporte SSH e V2Ray. Comece agora por apenas R$3,00!',
  );
  for (const selector of [
    'meta[name="title"]',
    'meta[property="og:title"]',
    'meta[property="twitter:title"]',
  ])
    document.querySelector(selector)?.setAttribute('content', document.title);
  for (const selector of [
    'meta[name="description"]',
    'meta[property="og:description"]',
    'meta[property="twitter:description"]',
  ])
    document.querySelector(selector)?.setAttribute('content', description);
  document
    .querySelector('meta[name="language"]')
    ?.setAttribute('content', locale);
}

export function setLanguagePreference(next: LanguagePreference) {
  preference = next;
  locale =
    next === 'auto'
      ? detectLocale(
          navigator.languages.length
            ? navigator.languages
            : [navigator.language],
        )
      : next;
  try {
    if (next === 'auto') localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, next);
  } catch {
    /* Keep the in-memory preference. */
  }
  updateDocument();
  listeners.forEach((listener) => listener());
}
window.addEventListener('languagechange', () => {
  if (preference === 'auto') setLanguagePreference('auto');
});
window.addEventListener('storage', (event) => {
  if (event.key === storageKey || event.key === null) {
    preference = readPreference();
    locale =
      preference === 'auto' ? detectLocale(navigator.languages) : preference;
    updateDocument();
    listeners.forEach((listener) => listener());
  }
});
updateDocument();
