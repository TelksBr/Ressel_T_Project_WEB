import { ChevronRight, PlayCircle, DollarSign, Shield, Lock, Zap } from 'lucide-react';

export function Hero() {
  const scrollToPlans = () => {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="container mx-auto px-4 sm:px-6">
      <div className="grid items-center gap-8 py-12 sm:gap-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="animate-fade-up text-center lg:text-left">
          <div className="section-badge mb-4 sm:mb-6">
            <Zap className="h-3.5 w-3.5" />
            Plataforma #1 para Revendedores
          </div>

          <h1 className="font-display text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            Seja um{' '}
            <span className="gradient-text">revendedor VPN</span>{' '}
            com qualidade premium
          </h1>

          <p className="mt-4 text-base leading-relaxed text-gray-400 sm:mt-6 sm:text-lg lg:text-xl">
            Painel web fluido e otimizado para gerenciar clientes. App leve com suporte
            a SSH e V2Ray — tudo que você precisa para escalar seu negócio.
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:justify-center lg:justify-start">
            <button
              onClick={scrollToPlans}
              className="btn-primary w-full px-6 py-3 sm:w-auto sm:px-8 sm:py-3.5"
              aria-label="Ver planos disponíveis"
            >
              Começar Agora
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <a
              href="https://play.google.com/store/apps/details?id=app.reselltproject"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full px-6 py-3 sm:w-auto sm:px-8 sm:py-3.5"
              aria-label="Baixar aplicativo na Play Store"
            >
              <PlayCircle className="h-5 w-5" aria-hidden="true" />
              Download App
            </a>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 sm:mt-10 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-6 lg:justify-start">
            <div className="text-center lg:text-left">
              <p className="font-display text-lg font-bold text-white sm:text-2xl">R$ 3,00</p>
              <p className="text-[10px] text-gray-500 sm:text-xs">a partir de</p>
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div className="text-center lg:text-left">
              <p className="font-display text-sm font-bold text-white sm:text-2xl">SSH + V2Ray</p>
              <p className="text-[10px] text-gray-500 sm:text-xs">protocolos</p>
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div className="text-center lg:text-left">
              <p className="font-display text-lg font-bold text-white sm:text-2xl">24/7</p>
              <p className="text-[10px] text-gray-500 sm:text-xs">suporte</p>
            </div>
          </div>
        </div>

        <div className="animate-fade-up animation-delay-200 relative" aria-hidden="true">
          <div className="premium-border glass-card p-4 sm:p-6 lg:p-8">
            <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-brand-500/30 hover:bg-white/[0.04] hover:shadow-glow-sm sm:p-6">
                <div className="icon-box mb-4 transition group-hover:scale-110">
                  <Shield className="h-6 w-6" />
                </div>
                <h2 className="font-display font-bold text-white">Sempre Atualizado</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  Métodos e protocolos mais recentes do mercado
                </p>
              </div>

              <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-brand-500/30 hover:bg-white/[0.04] hover:shadow-glow-sm sm:p-6">
                <div className="icon-box mb-4 transition group-hover:scale-110">
                  <Lock className="h-6 w-6" />
                </div>
                <h2 className="font-display font-bold text-white">Privacidade</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  Navegação anônima e segura garantida
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-3 rounded-xl border border-brand-500/20 bg-gradient-to-r from-brand-600/10 to-accent-cyan/5 p-4 transition hover:shadow-glow-sm sm:mt-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="icon-box h-12 w-12 shrink-0 sm:h-16 sm:w-16">
                  <DollarSign className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-base font-bold text-white sm:text-xl">Preços Acessíveis</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Comece a revender a partir de{' '}
                    <span className="font-semibold text-accent-gold">R$ 3,00</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -z-10 left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 animate-float rounded-full bg-brand-600/15 blur-[80px]" />
        </div>
      </div>
    </header>
  );
}
