import { Send, Phone, MessageCircle, HeadphonesIcon, Bot } from 'lucide-react';

const TELEGRAM_BOT_URL = 'https://t.me/ssh_t_project_vip_bot';

const contactOptions = [
  {
    icon: Bot,
    platform: 'Bot de Revenda',
    label: '@ssh_t_project_vip_bot',
    href: TELEGRAM_BOT_URL,
    accent: 'from-sky-500/10 to-blue-600/5',
    iconColor: 'text-sky-400',
    borderHover: 'hover:border-sky-500/30',
    featured: true,
  },
  {
    icon: Send,
    platform: 'Telegram',
    label: 'Suporte @telks13',
    href: 'https://t.me/telks13',
    accent: 'from-brand-500/10 to-brand-700/5',
    iconColor: 'text-brand-400',
    borderHover: 'hover:border-brand-500/30',
  },
  {
    icon: Phone,
    platform: 'WhatsApp',
    label: '(13) 99728-0020',
    href: 'https://wa.me/5513997280020',
    accent: 'from-green-500/10 to-emerald-600/5',
    iconColor: 'text-green-400',
    borderHover: 'hover:border-green-500/30',
  },
];

const reasons = [
  'Contratar plano crédito via @ssh_t_project_vip_bot',
  'Gerenciar clientes pelo bot no Telegram',
  'Tirar dúvidas sobre nossos serviços',
];

export function Contact() {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
      <div className="text-center">
        <div className="section-badge mb-4">
          <HeadphonesIcon className="h-3.5 w-3.5" />
          Suporte
        </div>
        <h2 className="section-title">
          Entre em <span className="gradient-text">contato</span>
        </h2>
        <p className="section-subtitle">
          Revenda pelo bot no Telegram ou fale com nossa equipe de suporte
        </p>
        <div className="divider-glow mt-6" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {contactOptions.map((option) => (
          <a
            key={option.platform}
            href={option.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group glass-card premium-border block p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-7 lg:p-8 ${option.borderHover} ${option.featured ? 'ring-1 ring-sky-500/20 sm:col-span-2 lg:col-span-1' : ''}`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${option.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />
            <div className="relative z-10">
              {option.featured && (
                <span className="mb-3 inline-flex rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-300">
                  Revenda via Bot
                </span>
              )}
              <div className="icon-box mx-auto mb-4 transition duration-300 group-hover:scale-110">
                <option.icon className={`h-6 w-6 ${option.iconColor}`} />
              </div>
              <h3 className="font-display text-lg font-bold text-white">{option.platform}</h3>
              <p className="mt-2 text-sm text-gray-400 transition group-hover:text-gray-300">
                {option.label}
              </p>
            </div>
          </a>
        ))}
      </div>

      <div className="glass-card premium-border mx-auto mt-8 max-w-2xl p-5 sm:mt-10 sm:p-8">
        <div className="relative z-10 flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
          <div className="icon-box h-11 w-11 shrink-0">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white">Como podemos ajudar?</h3>
            <ul className="mt-3 space-y-2">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="h-1 w-1 rounded-full bg-brand-400" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
