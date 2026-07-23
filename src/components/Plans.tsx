import { useEffect, useState, type ReactNode } from 'react';
import {
  Bot,
  Calendar,
  Check,
  Coins,
  Crown,
  CreditCard,
  ExternalLink,
  ShoppingCart,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { veltrixApi } from '../lib/veltrix-api';
import { veltrixConfig } from '../lib/config';
import { formatCurrency } from '../lib/format';
import { PurchaseModal } from './purchase/PurchaseModal';
import type { ResellerPlan } from '../types/veltrix';

const TELEGRAM_BOT_URL = 'https://t.me/ssh_t_project_vip_bot';

type PlanCategory = 'subscribe' | 'credit';

const categoryConfig: Record<
  PlanCategory,
  { label: string; shortLabel: string; icon: typeof Calendar; description: string; footnote: string }
> = {
  subscribe: {
    label: 'Planos Assinatura',
    shortLabel: 'Assinatura',
    icon: Calendar,
    description: 'Limite mensal de logins — ideal para revendedores que preferem o painel web.',
    footnote: 'Pagamento via PIX · Credenciais entregues na hora · Painel web incluso',
  },
  credit: {
    label: 'Planos Crédito',
    shortLabel: 'Crédito',
    icon: Coins,
    description: 'Créditos para criar logins — contrate e gerencie pelo bot oficial no Telegram.',
    footnote: 'Compra e gestão via @ssh_t_project_vip_bot · Bots Telegram inclusos',
  },
};

function isSubscribePlan(plan: ResellerPlan) {
  return plan.plan_type === 'subscribe' || plan.plan_type === 'subscription';
}

function isCreditPlan(plan: ResellerPlan) {
  return plan.plan_type === 'credit';
}

export function Plans() {
  const [plans, setPlans] = useState<ResellerPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ResellerPlan | null>(null);
  const [category, setCategory] = useState<PlanCategory>('subscribe');

  useEffect(() => {
    if (!veltrixConfig.isConfigured) {
      setLoading(false);
      setError('Não foi possível carregar os planos. Tente novamente ou fale conosco.');
      return;
    }

    veltrixApi
      .getResellerPlans()
      .then((data) => {
        setPlans(data);
        const hasSubscribe = data.some(isSubscribePlan);
        const hasCredit = data.some(isCreditPlan);
        if (hasSubscribe) setCategory('subscribe');
        else if (hasCredit) setCategory('credit');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar planos.'))
      .finally(() => setLoading(false));
  }, []);

  const subscribePlans = plans.filter(isSubscribePlan).sort((a, b) => a.price - b.price);
  const creditPlans = plans.filter(isCreditPlan).sort((a, b) => a.price - b.price);
  const activePlans = category === 'subscribe' ? subscribePlans : creditPlans;
  const activeConfig = categoryConfig[category];
  const featuredIndex = activePlans.length > 1 ? Math.floor(activePlans.length / 2) : 0;

  const gridClass =
    activePlans.length === 1
      ? 'max-w-md mx-auto sm:grid sm:grid-cols-1'
      : activePlans.length === 2
        ? 'max-w-4xl mx-auto sm:grid sm:grid-cols-2'
        : 'max-w-6xl mx-auto sm:grid sm:grid-cols-2 xl:grid-cols-3';

  return (
    <section id="planos" className="section-anchor container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
      <div className="text-center">
        <div className="section-badge mb-4">
          <CreditCard className="h-3.5 w-3.5" />
          Planos
        </div>
        <h2 className="section-title">
          Escolha seu plano e <span className="gradient-text">compre agora</span>
        </h2>
        <p className="section-subtitle px-2">
          Assinatura mensal pelo site ou planos crédito via bot no Telegram
        </p>
        <div className="divider-glow mt-6" />
      </div>

      {!loading && !error && plans.length > 0 && (
        <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12">
          <PlanTypeSwitch
            category={category}
            onChange={setCategory}
            subscribeCount={subscribePlans.length}
            creditCount={creditPlans.length}
          />
          <p className="max-w-xl px-4 text-center text-sm leading-relaxed text-gray-400 sm:text-base">
            {activeConfig.description}
          </p>
        </div>
      )}

      {loading && (
        <div className={`mt-10 plans-carousel sm:mt-12 ${gridClass}`}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="plans-carousel-item">
              <PlanSkeleton />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="mt-12 mx-auto max-w-lg rounded-2xl border border-red-500/30 bg-red-500/10 p-5 sm:p-6 text-center sm:mt-14">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
          <p className="text-sm text-red-300">{error}</p>
          <a
            href="https://t.me/telks13"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary mt-4 inline-flex text-sm"
          >
            Falar no Telegram
          </a>
        </div>
      )}

      {!loading && !error && activePlans.length === 0 && (
        <div className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] py-14 text-center sm:mt-14">
          <p className="text-sm text-gray-500 sm:text-base">
            Nenhum plano de {activeConfig.shortLabel.toLowerCase()} disponível no momento.
          </p>
          {category === 'subscribe' && creditPlans.length > 0 && (
            <button onClick={() => setCategory('credit')} className="btn-secondary mt-4 text-sm">
              Ver planos crédito
            </button>
          )}
          {category === 'credit' && subscribePlans.length > 0 && (
            <button onClick={() => setCategory('subscribe')} className="btn-secondary mt-4 text-sm">
              Ver planos assinatura
            </button>
          )}
        </div>
      )}

      {!loading && !error && activePlans.length > 0 && (
        <div id="plans-panel" role="tabpanel" className="contents">
          <div className={`mt-10 plans-carousel sm:mt-12 sm:gap-6 lg:gap-8 ${gridClass}`}>
            {activePlans.map((plan, index) => (
              <div key={plan.id} className="plans-carousel-item h-full">
                <PlanCard
                  plan={plan}
                  category={category}
                  featured={index === featuredIndex && activePlans.length > 1}
                  onPurchase={() => setSelectedPlan(plan)}
                />
              </div>
            ))}
          </div>

          <ul className="mt-8 flex flex-col items-center gap-2 px-4 text-center text-xs text-gray-500 sm:mt-10 sm:hidden">
            {activeConfig.footnote.split(' · ').map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-brand-400" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-center text-sm text-gray-500 sm:mt-10 sm:flex">
            {activeConfig.footnote.split(' · ').map((item) => (
              <span key={item} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-brand-400" />
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {selectedPlan && category === 'subscribe' && (
        <PurchaseModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </section>
  );
}

function PlanTypeSwitch({
  category,
  onChange,
  subscribeCount,
  creditCount,
}: {
  category: PlanCategory;
  onChange: (cat: PlanCategory) => void;
  subscribeCount: number;
  creditCount: number;
}) {
  return (
    <div className="plan-switch w-full max-w-sm sm:max-w-md" role="tablist" aria-label="Tipo de plano">
      <button
        role="tab"
        aria-selected={category === 'subscribe'}
        aria-controls="plans-panel"
        disabled={subscribeCount === 0}
        onClick={() => onChange('subscribe')}
        className={`plan-switch-btn ${category === 'subscribe' ? 'plan-switch-btn-active' : 'plan-switch-btn-inactive'} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <Calendar className="h-4 w-4 shrink-0" />
        <span className="truncate">Assinatura</span>
        {subscribeCount > 0 && (
          <span className="ml-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold">
            {subscribeCount}
          </span>
        )}
      </button>
      <button
        role="tab"
        aria-selected={category === 'credit'}
        aria-controls="plans-panel"
        disabled={creditCount === 0}
        onClick={() => onChange('credit')}
        className={`plan-switch-btn ${category === 'credit' ? 'plan-switch-btn-active' : 'plan-switch-btn-inactive'} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <Coins className="h-4 w-4 shrink-0" />
        <span className="truncate">Crédito</span>
        {creditCount > 0 && (
          <span className="ml-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold">
            {creditCount}
          </span>
        )}
      </button>
    </div>
  );
}

function getPlanSubtitle(plan: ResellerPlan, isCredit: boolean): string {
  if (isCredit && plan.credit_amount) {
    return `Crédito · ${plan.credit_amount} créditos`;
  }
  if (plan.login_limit) {
    return `Mensal · ${plan.login_limit} logins`;
  }
  return isCredit ? 'Plano Crédito' : 'Plano Mensal';
}

function PlanSkeleton() {
  return (
    <div className="glass-card h-full p-5 sm:p-7">
      <div className="card-content space-y-4">
        <div className="skeleton h-5 w-28" />
        <div className="skeleton h-10 w-36" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton mt-4 h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  category,
  featured,
  onPurchase,
}: {
  plan: ResellerPlan;
  category: PlanCategory;
  featured: boolean;
  onPurchase: () => void;
}) {
  const isCredit = category === 'credit';

  const CardWrapper = featured
    ? ({ children }: { children: ReactNode }) => (
        <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-b from-brand-900/40 to-surface-card p-5 shadow-glow transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover sm:p-7 lg:p-8">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent-cyan/10 blur-3xl" />
          {children}
        </div>
      )
    : ({ children }: { children: ReactNode }) => (
        <div className="group glass-card premium-border flex h-full flex-col p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover sm:p-7 lg:p-8">
          {children}
        </div>
      );

  return (
    <CardWrapper>
      <div className="card-content relative z-[1] flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {featured && (
              <div className="mb-2 flex items-center gap-2">
                <Crown className="h-4 w-4 shrink-0 text-accent-gold sm:h-5 sm:w-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold sm:text-xs">
                  Mais Popular
                </span>
              </div>
            )}
            <h3 className="truncate font-display text-xl font-bold text-white sm:text-2xl">{plan.name}</h3>
            <p className="mt-1 text-xs text-brand-300/80 sm:text-sm">
              {getPlanSubtitle(plan, isCredit)}
            </p>
          </div>
          {featured ? (
            <Sparkles className="h-5 w-5 shrink-0 text-accent-gold" />
          ) : (
            <span className="shrink-0 rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-[10px] font-semibold text-brand-300 sm:px-3 sm:text-xs">
              {isCredit ? 'Crédito' : 'Mensal'}
            </span>
          )}
        </div>

        <div className="mt-6 sm:mt-8">
          <div className="flex flex-wrap items-baseline gap-x-1 gap-y-1">
            <span
              className={`font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl ${featured ? 'gradient-text-gold' : 'text-white'}`}
            >
              {formatCurrency(plan.price)}
            </span>
            {plan.duration_days ? (
              <span className="text-xs text-gray-500 sm:text-sm">/ {plan.duration_days} dias</span>
            ) : isCredit ? (
              <span className="text-xs text-gray-500 sm:text-sm">/ pacote</span>
            ) : null}
          </div>
        </div>

        {plan.description && (
          <p className="mt-4 text-sm leading-relaxed text-gray-400 sm:mt-6">{plan.description}</p>
        )}

        <ul className="mt-4 space-y-2.5 sm:mt-6 sm:space-y-3">
          {plan.login_limit ? (
            <PlanFeature>Limite de {plan.login_limit} logins</PlanFeature>
          ) : null}
          {plan.credit_amount ? (
            <PlanFeature>{plan.credit_amount} créditos inclusos</PlanFeature>
          ) : null}
          {isCredit ? (
            <>
              <PlanFeature>Gestão via bot Telegram</PlanFeature>
              <PlanFeature>Painel web incluso</PlanFeature>
            </>
          ) : (
            <>
              <PlanFeature>Painel web completo</PlanFeature>
              <PlanFeature>Suporte SSH e V2Ray</PlanFeature>
              <PlanFeature>Credenciais na hora</PlanFeature>
            </>
          )}
        </ul>

        <div className="mt-auto pt-6 sm:pt-8">
          {isCredit ? (
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full py-3 text-sm sm:py-3.5 sm:text-base"
            >
              <Bot className="h-4 w-4" />
              Comprar via Bot
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <button
              onClick={onPurchase}
              className="btn-primary w-full py-3 text-sm sm:py-3.5 sm:text-base"
            >
              <ShoppingCart className="h-4 w-4" />
              Comprar Agora
            </button>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}

function PlanFeature({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-gray-300 sm:gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/20">
        <Check className="h-3 w-3 text-brand-400" />
      </div>
      <span className="leading-snug">{children}</span>
    </li>
  );
}
