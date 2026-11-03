import { useSyncExternalStore } from 'react';
import { Languages } from 'lucide-react';
import {
  getLanguagePreference,
  setLanguagePreference,
  subscribeLanguage,
  t,
  type LanguagePreference,
} from '../lib/i18n';

export function LanguageSelector() {
  const preference = useSyncExternalStore(
    subscribeLanguage,
    getLanguagePreference,
  );
  return (
    <label className="ml-auto mr-2 inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-surface px-2 py-2 text-xs text-gray-200 md:ml-0 md:mr-0">
      <Languages className="h-4 w-4 text-brand-300" aria-hidden="true" />
      <span className="sr-only">{t('Idioma')}</span>
      <select
        value={preference}
        onChange={(event) =>
          setLanguagePreference(event.target.value as LanguagePreference)
        }
        className="w-24 cursor-pointer bg-surface text-xs text-gray-200 outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <option value="auto">{t('Automático')}</option>
        <option value="pt-BR">Português</option>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </label>
  );
}
