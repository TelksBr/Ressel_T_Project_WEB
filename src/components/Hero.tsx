import { formatCurrency } from '../lib/format';
import { t } from '../lib/i18n';
import {
  ChevronRight,
  PlayCircle,
  DollarSign,
  Shield,
  Lock,
  Zap,
  FlaskConical,
} from 'lucide-react';
import { scrollToSection } from '../lib/scroll';

export function Hero() {
  return (
    <header className="section-anchor container mx-auto px-4 sm:px-6">
      <div className="grid items-start gap-10 py-12 sm:gap-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
        <div className="animate-fade-up min-w-0 text-center lg:text-left">
          <div className="section-badge mb-4 sm:mb-6">
            <Zap className="h-3.5 w-3.5" />
            {t('Plataforma #1 para Revendedores')}
          </div>

          <h1 className="font-display text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            {t('Seja um')}{' '}
            <span className="gradient-text">{t('revendedor VPN')}</span>{' '}
            {t('com qualidade premium')}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-gray-400 sm:mt-6 sm:text-lg lg:text-xl">
            {t(
              'Painel web fluido e otimizado para gerenciar clientes. App leve com suporte a SSH e V2Ray — tudo que você precisa para escalar seu negócio.',
            )}
          </p>

          <div className="relative z-[2] mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:justify-center lg:justify-start">
            <button
              onClick={() => scrollToSection('planos')}
              className="btn-primary w-full px-6 py-3.5 sm:w-auto sm:px-8"
              aria-label={t('Ver planos disponíveis')}
            >
              {t('Começar Agora')}{' '}
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => scrollToSection('teste')}
              className="btn-secondary w-full px-6 py-3.5 sm:w-auto sm:px-8"
            >
              <FlaskConical className="h-5 w-5" aria-hidden="true" />
              {t('Teste Grátis')}
            </button>
            <a
              href="https://play.google.com/store/apps/details?id=app.reselltproject"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full px-6 py-3.5 sm:w-auto sm:px-8"
              aria-label={t('Baixar aplicativo na Play Store')}
            >
              <PlayCircle className="h-5 w-5" aria-hidden="true" />
              {t('Download App')}
            </a>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-6 lg:justify-start">
            <Stat label={t('A partir de')} value={formatCurrency(3)} />
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <Stat label={t('Protocolos')} value={t('SSH + V2Ray')} />
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <Stat label={t('Suporte')} value="24/7" />
          </div>
        </div>

        <div className="animate-fade-up animation-delay-200 relative min-w-0">
          <div className="glass-card premium-border p-4 sm:p-6 lg:p-8">
            <div className="card-content grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <FeatureMini
                icon={Shield}
                title={t('Sempre Atualizado')}
                description={t('Métodos e protocolos mais recentes do mercado')}
              />
              <FeatureMini
                icon={Lock}
                title={t('Privacidade')}
                description={t('Navegação anônima e segura garantida')}
              />
            </div>

            <div className="card-content mt-3 rounded-xl border border-brand-500/20 bg-gradient-to-r from-brand-600/10 to-accent-cyan/5 p-4 sm:mt-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="icon-box h-12 w-12 shrink-0 sm:h-14 sm:w-14">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-base font-bold text-white sm:text-xl">
                    {t('Preços Acessíveis')}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {t('Comece a revender a partir de')}{' '}
                    <span className="font-semibold text-accent-gold">
                      {formatCurrency(3)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 sm:block sm:border-0 sm:bg-transparent sm:p-0 sm:text-center lg:text-left">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-display text-lg font-bold text-white sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function FeatureMini({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Shield;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
      <div className="icon-box mb-3 h-12 w-12">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="font-display text-base font-bold text-white sm:text-lg">
        {title}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
        {description}
      </p>
    </div>
  );
}
