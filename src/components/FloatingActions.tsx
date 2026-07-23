import { MessageCircle, FlaskConical } from 'lucide-react';
import { scrollToSection } from '../lib/scroll';

const WHATSAPP_URL = 'https://wa.me/5513997280020';

export function FloatingActions() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 pb-[env(safe-area-inset-bottom)] md:hidden">
      <button
        onClick={() => scrollToSection('teste')}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-500/40 bg-brand-600 text-white shadow-glow-sm transition active:scale-95"
        aria-label="Teste grátis"
      >
        <FlaskConical className="h-5 w-5" />
      </button>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-green-500/40 bg-green-600 text-white shadow-lg transition active:scale-95"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
    </div>
  );
}
