import { useState } from 'react';
import { Shield, Menu, X, Sparkles } from 'lucide-react';
import { scrollToSection } from '../lib/scroll';
import { veltrixConfig } from '../lib/config';

const navLinks = [
  { id: 'planos', label: 'Planos' },
  { id: 'teste', label: 'Teste Grátis' },
  { id: 'contato', label: 'Contato' },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goTo = (id: string) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-surface/80 backdrop-blur-xl md:backdrop-blur-2xl">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between sm:h-[72px]">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex min-w-0 items-center gap-2 sm:gap-3"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-500/30 bg-gradient-to-br from-brand-600/30 to-brand-800/20 sm:h-10 sm:w-10">
              <Shield className="h-4 w-4 text-brand-300 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="truncate font-display text-base font-bold leading-tight text-white sm:text-lg">
                Resell T Project
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-brand-400/80 sm:block">
                Premium VPN
              </span>
            </div>
          </a>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => goTo(link.id)}
                className="text-sm font-medium text-gray-400 transition hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2.5 text-gray-300 transition hover:bg-white/5 hover:text-white md:hidden"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <button onClick={() => goTo('planos')} className="btn-primary px-5 py-2.5 text-sm">
              <Sparkles className="h-4 w-4" />
              Começar Agora
            </button>
            <a
              href={veltrixConfig.panelUrl}
              className="btn-secondary px-5 py-2.5 text-sm"
            >
              Painel de Login
            </a>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-white/[0.06] pb-4 pt-3 md:hidden">
            <div className="mb-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => goTo(link.id)}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => goTo('planos')} className="btn-primary w-full py-3 text-sm">
                <Sparkles className="h-4 w-4" />
                Começar Agora
              </button>
              <a
                href={veltrixConfig.panelUrl}
                className="btn-secondary w-full py-3 text-center text-sm"
              >
                Painel de Login
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
