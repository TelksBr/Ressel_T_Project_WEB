import { t } from '../lib/i18n';
import { Shield, Heart, PlayCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-500/30 bg-gradient-to-br from-brand-600/30 to-brand-800/20">
              <Shield className="h-5 w-5 text-brand-300" />
            </div>
            <div>
              <span className="font-display text-lg font-bold text-white">
                Resell T Project
              </span>
              <p className="text-xs text-gray-500">
                {t('Revenda VPN Premium')}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 md:items-end">
            <a
              href="https://play.google.com/store/apps/details?id=app.reselltproject"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-brand-300 transition hover:text-white"
            >
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              {t('Baixar o app Resell T Project na Play Store')}
            </a>
            <p className="text-sm text-gray-500">
              © {currentYear}{' '}
              {t('Resell T Project. Todos os direitos reservados.')}
            </p>
            <p className="flex items-center gap-1 text-xs text-gray-600">
              {t('Criado com')} <Heart className="h-3 w-3 text-brand-500" />{' '}
              {t('por SSH T Project')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
