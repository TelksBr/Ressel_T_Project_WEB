import {
  Server,
  GamepadIcon,
  Globe,
  PlayCircle,
  Smartphone,
  Zap,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Server,
    title: 'Servidor BR',
    description: 'Servidores de alta performance localizados no Brasil',
  },
  {
    icon: GamepadIcon,
    title: 'Suporte Jogos',
    description: 'Otimizado para jogos online e chamadas de voz',
  },
  {
    icon: Globe,
    title: 'CloudFront',
    description: 'CDN global para máximo desempenho e estabilidade',
  },
  {
    icon: PlayCircle,
    title: 'Streaming',
    description: 'Perfeito para streaming de conteúdo em alta qualidade',
  },
  {
    icon: Smartphone,
    title: 'App na Play Store',
    description: 'Aplicativo oficial disponível para Android',
  },
  {
    icon: Zap,
    title: 'Sempre Atualizado',
    description: 'Métodos e sistemas sempre na versão mais recente',
  },
];

export function Features() {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
      <div className="glass-card premium-border overflow-hidden">
        <div className="relative p-5 sm:p-10 lg:p-16">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-600/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent-cyan/5 blur-3xl" />

          <div className="relative z-10 text-center">
            <div className="section-badge mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Recursos
            </div>
            <h2 className="section-title">
              Tudo incluso, <span className="gradient-text">sem surpresas</span>
            </h2>
            <p className="section-subtitle">
              Infraestrutura robusta para entregar a melhor experiência aos seus clientes
            </p>
            <div className="divider-glow mt-6" />
          </div>

          <div className="relative z-10 mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-300 hover:border-brand-500/20 hover:bg-white/[0.04] hover:shadow-glow-sm sm:gap-4 sm:p-5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="icon-box h-11 w-11 shrink-0 transition duration-300 group-hover:scale-110">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
