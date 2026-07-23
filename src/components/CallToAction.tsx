import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  Rocket,
  Shield,
  Sparkles,
} from 'lucide-react';
import { veltrixApi, VeltrixApiError } from '../lib/veltrix-api';
import { veltrixConfig } from '../lib/config';
import { formatPhone, isTrustedEmailDomain, isValidEmail, stripDigits } from '../lib/format';
import type { TestConfig } from '../types/veltrix';

export function CallToAction() {
  const [config, setConfig] = useState<TestConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [includeV2ray, setIncludeV2ray] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!veltrixConfig.isConfigured) {
      setLoadingConfig(false);
      return;
    }

    veltrixApi
      .getTestConfig()
      .then(setConfig)
      .catch(() => setConfig(null))
      .finally(() => setLoadingConfig(false));
  }, []);

  const scrollToPlans = () => {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!isValidEmail(email)) {
      setError('Informe um e-mail válido.');
      return;
    }

    if (config && !isTrustedEmailDomain(email, config.trusted_email_domains)) {
      setError('Use um e-mail de provedor conhecido (Gmail, Outlook, Yahoo, iCloud, Proton, etc.).');
      return;
    }

    setSubmitting(true);

    try {
      const result = await veltrixApi.createTest({
        email,
        phone: stripDigits(phone) || undefined,
        include_v2ray: includeV2ray,
      });

      setSuccessMessage(result.message);
      setEmail('');
      setPhone('');
      setIncludeV2ray(false);
    } catch (err) {
      setError(err instanceof VeltrixApiError ? err.message : 'Não foi possível criar o teste.');
    } finally {
      setSubmitting(false);
    }
  };

  const testEnabled = config?.enabled ?? false;
  const durationLabel =
    config && config.duration_hours > 0
      ? config.duration_hours === 1
        ? '1 hora'
        : `${config.duration_hours} horas`
      : null;

  return (
    <section id="teste" className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
      <div className="relative overflow-hidden rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-900/60 via-surface-card to-brand-950/80 shadow-glow sm:rounded-3xl">
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-accent-cyan/10 blur-3xl" />
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHg9IjAiIHk9IjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDQpIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"
          aria-hidden="true"
        />

        <div className="relative z-10 grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-14">
          {/* Info */}
          <div className="text-center lg:text-left">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-400/30 bg-brand-500/10 shadow-glow-sm lg:mx-0">
              <Rocket className="h-7 w-7 text-brand-300" />
            </div>

            <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Faça seu <span className="gradient-text">Teste Grátis</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">
              Experimente nosso serviço sem compromisso. As credenciais serão enviadas
              diretamente para o seu e-mail.
            </p>

            {!loadingConfig && testEnabled && durationLabel && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-200">
                  <Clock className="h-3.5 w-3.5" />
                  Duração: {durationLabel}
                </span>
                {config && config.cooldown_hours > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-400">
                    Cooldown: {config.cooldown_hours}h entre testes
                  </span>
                )}
              </div>
            )}

            <button
              onClick={scrollToPlans}
              className="btn-secondary mt-6 hidden px-6 py-3 text-sm lg:inline-flex"
            >
              <Sparkles className="h-4 w-4" />
              Ver Planos de Revenda
            </button>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-white/10 bg-surface/60 p-5 backdrop-blur-sm sm:p-6">
            {loadingConfig ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-gray-400">
                <Loader2 className="h-7 w-7 animate-spin text-brand-400" />
                <p className="text-sm">Carregando teste grátis...</p>
              </div>
            ) : !veltrixConfig.isConfigured ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Teste indisponível — configure a API no arquivo <code className="text-brand-300">.env</code>.
              </div>
            ) : !testEnabled ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <AlertCircle className="h-8 w-8 text-amber-400" />
                <p className="text-sm text-gray-400">Testes gratuitos indisponíveis no momento.</p>
              </div>
            ) : successMessage ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
                  <CheckCircle2 className="h-7 w-7 text-green-400" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Teste solicitado!</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{successMessage}</p>
                  <p className="mt-3 text-xs text-gray-500">
                    Verifique sua caixa de entrada e spam. As credenciais chegam por e-mail.
                  </p>
                </div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="btn-secondary w-full py-3 text-sm sm:w-auto"
                >
                  Solicitar outro teste
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Receber credenciais por e-mail</h3>
                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Gmail, Outlook, Yahoo, iCloud, Proton e outros provedores confiáveis.
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="test-email" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-300">
                    <Mail className="h-3.5 w-3.5 text-brand-400" />
                    E-mail
                  </label>
                  <input
                    id="test-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@gmail.com"
                    className="input-field"
                    autoComplete="email"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label htmlFor="test-phone" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-300">
                    WhatsApp <span className="text-xs font-normal text-gray-500">(opcional)</span>
                  </label>
                  <input
                    id="test-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="+55 (13) 99999-9999"
                    className="input-field"
                    disabled={submitting}
                  />
                </div>

                {config?.include_v2ray && (
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 transition hover:border-brand-500/30">
                    <input
                      type="checkbox"
                      checked={includeV2ray}
                      onChange={(e) => setIncludeV2ray(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-brand-600 focus:ring-brand-500"
                      disabled={submitting}
                    />
                    <div>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-white">
                        <Shield className="h-3.5 w-3.5 text-brand-400" />
                        Incluir credencial V2Ray
                      </span>
                      <p className="mt-0.5 text-xs text-gray-500">Receba também a configuração V2Ray no e-mail.</p>
                    </div>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-3.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gerando teste...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Enviar Teste Grátis
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] leading-relaxed text-gray-500 sm:text-xs">
                  Suas credenciais nunca são exibidas aqui — enviamos apenas para o e-mail informado.
                </p>
              </form>
            )}

            <button
              onClick={scrollToPlans}
              className="btn-secondary mt-4 w-full py-3 text-sm lg:hidden"
            >
              Ver Planos de Revenda
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
