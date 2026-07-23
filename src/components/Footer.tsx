import { Shield, Heart } from 'lucide-react';

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
              <span className="font-display text-lg font-bold text-white">Resell T Project</span>
              <p className="text-xs text-gray-500">Revenda VPN Premium</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 md:items-end">
            <p className="text-sm text-gray-500">
              © {currentYear} Resell T Project. Todos os direitos reservados.
            </p>
            <p className="flex items-center gap-1 text-xs text-gray-600">
              Criado com <Heart className="h-3 w-3 text-brand-500" /> por SSH T Project
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
