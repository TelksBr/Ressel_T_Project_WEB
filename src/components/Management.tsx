import { Globe, Info, Send, Layers, ExternalLink } from 'lucide-react';

const TELEGRAM_BOT_URL = 'https://t.me/ssh_t_project_vip_bot';

const channels = [
  {
    icon: Send,
    title: 'Telegram Bot',
    description: 'Revenda e gerencie seus clientes via Telegram — rápido, prático e automatizado.',
    note: 'Disponível na modalidade crédito. Acesse o bot para contratar e gerenciar.',
    accent: 'from-sky-500/20 to-blue-600/5',
    iconColor: 'text-sky-400',
    borderColor: 'hover:border-sky-500/30',
    href: TELEGRAM_BOT_URL,
    cta: 'Abrir @ssh_t_project_vip_bot',
    featured: true,
  },
  {
    icon: Globe,
    title: 'Painel Web',
    description: 'Interface web completa, intuitiva e otimizada para desktop e mobile.',
    note: 'Disponível em todas as modalidades',
    accent: 'from-brand-500/20 to-brand-700/5',
    iconColor: 'text-brand-400',
    borderColor: 'hover:border-brand-500/30',
    href: 'https://painel.reselltproject.store',
    cta: 'Acessar Painel',
  },
];

export function Management() {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
      <div className="text-center">
        <div className="section-badge mb-4">
          <Layers className="h-3.5 w-3.5" />
          Gerenciamento
        </div>
        <h2 className="section-title">
          Controle total, <span className="gradient-text">do seu jeito</span>
        </h2>
        <p className="section-subtitle">
          Painel web ou revenda automatizada pelo bot oficial no Telegram
        </p>
        <div className="divider-glow mt-6" />
      </div>

      <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 md:max-w-4xl md:mx-auto">
        {channels.map((channel) => (
          <div
            key={channel.title}
            className={`group glass-card premium-border p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover sm:p-7 lg:p-8 ${channel.borderColor}`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${channel.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            />

            <div className="relative z-10 flex h-full flex-col">
              {channel.featured && (
                <span className="mb-4 inline-flex w-fit rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-300">
                  Revenda via Bot
                </span>
              )}

              <div className="icon-box mb-6 transition duration-300 group-hover:scale-110 group-hover:shadow-glow">
                <channel.icon className={`h-6 w-6 ${channel.iconColor}`} />
              </div>

              <h3 className="font-display text-xl font-bold text-white">{channel.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{channel.description}</p>

              <div className="mt-6 flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <p className="text-xs leading-relaxed text-gray-400">{channel.note}</p>
              </div>

              <a
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto pt-6 ${channel.featured ? 'btn-primary' : 'btn-secondary'} w-full py-3 text-center text-sm`}
              >
                {channel.cta}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
