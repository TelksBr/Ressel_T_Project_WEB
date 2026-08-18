import { useCallback, useEffect, useState, type ComponentType } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Crown,
  Loader2,
  Lock,
  Mail,
  QrCode,
  Shield,
  User,
  X,
} from 'lucide-react';
import { veltrixApi, getErrorMessage } from '../../lib/veltrix-api';
import { veltrixConfig } from '../../lib/config';
import {
  formatCpf,
  formatCurrency,
  formatPhone,
  isValidCpf,
  isValidEmail,
  paymentMethodLabel,
  stripDigits,
} from '../../lib/format';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { usePaymentPolling } from '../../hooks/usePaymentPolling';
import type {
  PaymentMethod,
  PurchaseFormData,
  PurchaseStep,
  ResellerPlan,
} from '../../types/veltrix';

interface PurchaseModalProps {
  plan: ResellerPlan;
  onClose: () => void;
}

const initialForm = (plan: ResellerPlan): PurchaseFormData => ({
  plan,
  resellerUsername: '',
  resellerEmail: '',
  resellerPassword: '',
  customerName: '',
  customerEmail: '',
  customerCpf: '',
  customerWhatsapp: '',
  paymentMethod: null,
});

const steps: { key: PurchaseStep; label: string }[] = [
  { key: 'credentials', label: 'Conta' },
  { key: 'payment', label: 'Pagamento' },
  { key: 'pix', label: 'PIX' },
  { key: 'success', label: 'Concluído' },
];

export function PurchaseModal({ plan, onClose }: PurchaseModalProps) {
  const [step, setStep] = useState<PurchaseStep>('credentials');
  useBodyScrollLock(true);
  const [form, setForm] = useState<PurchaseFormData>(() => initialForm(plan));
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{ paymentId: string; qrBase64?: string; copyPaste?: string } | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [copied, setCopied] = useState(false);

  const updateForm = <K extends keyof PurchaseFormData>(key: K, value: PurchaseFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const checkUsername = useCallback(async (username: string) => {
    if (username.length < 3) {
      setUsernameStatus('idle');
      return;
    }
    setUsernameStatus('checking');
    try {
      const available = await veltrixApi.checkUsername(username);
      setUsernameStatus(available ? 'available' : 'taken');
    } catch (err) {
      const message = getErrorMessage(err, '');
      if (/já está em uso|already (in )?use|indisponível/i.test(message)) {
        setUsernameStatus('taken');
        setError(message);
      } else {
        setUsernameStatus('idle');
      }
    }
  }, []);

  const checkEmail = useCallback(async (email: string) => {
    if (!isValidEmail(email)) {
      setEmailStatus('idle');
      return;
    }
    setEmailStatus('checking');
    try {
      const available = await veltrixApi.checkEmail(email);
      setEmailStatus(available ? 'available' : 'taken');
    } catch (err) {
      const message = getErrorMessage(err, '');
      if (/já está em uso|already (in )?use|indisponível/i.test(message)) {
        setEmailStatus('taken');
        setError(message);
      } else {
        setEmailStatus('idle');
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => checkUsername(form.resellerUsername), 500);
    return () => clearTimeout(timer);
  }, [form.resellerUsername, checkUsername]);

  useEffect(() => {
    const timer = setTimeout(() => checkEmail(form.resellerEmail), 500);
    return () => clearTimeout(timer);
  }, [form.resellerEmail, checkEmail]);

  useEffect(() => {
    if (step !== 'payment') return;

    setLoadingMethods(true);
    veltrixApi
      .getPaymentMethods(plan.price)
      .then((res) => {
        const methods = (res.methods ?? []).filter((method) => {
          const type = method.type.toLowerCase();
          const methodId = (method.method_id ?? '').toLowerCase();
          return type === 'pix' || methodId === 'pix';
        });

        setPaymentMethods(methods);
        setForm((prev) => ({ ...prev, paymentMethod: methods[0] ?? null }));

        if (methods.length === 0) {
          setError('Nenhum método PIX disponível para este plano.');
        }
      })
      .catch((err) => setError(getErrorMessage(err, 'Não foi possível carregar os métodos de pagamento.')))
      .finally(() => setLoadingMethods(false));
  }, [step, plan.price]);

  const { status: paymentStatus, provisioning, credentials, error: pollingError } = usePaymentPolling({
    paymentId: pixData?.paymentId ?? null,
    enabled: step === 'pix' && Boolean(pixData?.paymentId),
    onApproved: () => setStep('success'),
    onRejected: (msg) => setError(msg ?? 'Pagamento recusado ou cancelado.'),
  });

  const validateCredentials = (): boolean => {
    if (!/^[a-zA-Z0-9]{3,32}$/.test(form.resellerUsername)) {
      setError('Username deve ter 3 a 32 caracteres, apenas letras e números.');
      return false;
    }
    if (usernameStatus === 'checking' || emailStatus === 'checking') {
      setError('Aguarde a verificação do username e e-mail.');
      return false;
    }
    if (usernameStatus === 'taken') {
      setError('Este username já está em uso.');
      return false;
    }
    if (!isValidEmail(form.resellerEmail)) {
      setError('Informe um e-mail válido para a conta de revenda.');
      return false;
    }
    if (emailStatus === 'taken') {
      setError('Este e-mail já está em uso.');
      return false;
    }
    if (form.resellerPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const validatePayment = (): boolean => {
    if (!form.customerName.trim()) {
      setError('Informe seu nome completo.');
      return false;
    }
    if (!isValidEmail(form.customerEmail)) {
      setError('Informe um e-mail válido.');
      return false;
    }
    if (!isValidCpf(form.customerCpf)) {
      setError('Informe um CPF válido.');
      return false;
    }
    if (!form.paymentMethod) {
      setError('Selecione um método de pagamento.');
      return false;
    }
    return true;
  };

  const handleCreatePayment = async () => {
    if (!form.paymentMethod) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await veltrixApi.createPayment({
        plan_id: plan.id,
        gateway_id: form.paymentMethod.gateway_id,
        payment_method_type: form.paymentMethod.method_id || form.paymentMethod.type,
        customer_name: form.customerName.trim(),
        customer_email: form.customerEmail.trim(),
        customer_cpf: stripDigits(form.customerCpf),
        customer_whatsapp: stripDigits(form.customerWhatsapp) || undefined,
        identification_type: 'CPF',
        reseller_username: form.resellerUsername.trim(),
        reseller_email: form.resellerEmail.trim(),
        reseller_password: form.resellerPassword,
      });

      const qrBase64 = result.pix_qr_code_base64 || result.qr_code_base64;
      const copyPaste = result.pix_copy_paste || result.copy_paste || result.emv;

      if (!result.payment_id) {
        throw new Error('Pagamento criado, mas ID não retornado pela API.');
      }

      setPixData({
        paymentId: result.payment_id,
        qrBase64: qrBase64?.startsWith('data:') ? qrBase64 : qrBase64 ? `data:image/png;base64,${qrBase64}` : undefined,
        copyPaste,
      });
      setStep('pix');
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao processar pagamento.'));
    } finally {
      setSubmitting(false);
    }
  };

  const copyPixCode = async () => {
    if (!pixData?.copyPaste) return;
    await navigator.clipboard.writeText(pixData.copyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (step === 'pix') return;
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [step, onClose]);

  const handleBackdropClick = () => {
    if (step === 'pix') return;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleBackdropClick} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-modal-title"
        className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-surface-raised shadow-2xl sm:max-h-[95vh] sm:rounded-3xl pb-[env(safe-area-inset-bottom)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-4 py-3.5 sm:px-6 sm:py-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-400 sm:text-xs">
              Comprar Plano
            </p>
            <h3 id="purchase-modal-title" className="truncate font-display text-base font-bold text-white sm:text-lg">{plan.name}</h3>
            <p className="text-sm text-gray-400">{formatCurrency(plan.price)}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step indicator */}
        {step !== 'success' && (
          <>
            <p className="border-b border-white/[0.06] px-4 py-2 text-center text-[11px] text-gray-500 sm:hidden">
              Passo {currentStepIndex + 1} de 3 — {steps[currentStepIndex]?.label}
            </p>
            <div className="flex items-center gap-1 border-b border-white/[0.06] px-3 py-2.5 sm:gap-2 sm:px-6 sm:py-3">
              {steps.slice(0, 3).map((s, i) => (
                <div key={s.key} className="flex flex-1 items-center gap-1 sm:gap-2">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition sm:h-7 sm:w-7 sm:text-xs ${
                      i < currentStepIndex
                        ? 'bg-brand-500 text-white'
                        : i === currentStepIndex
                          ? 'border border-brand-400 bg-brand-500/20 text-brand-300'
                          : 'border border-white/10 text-gray-500'
                    }`}
                  >
                    {i < currentStepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className={`hidden text-xs sm:block ${i === currentStepIndex ? 'text-white' : 'text-gray-500'}`}>
                    {s.label}
                  </span>
                  {i < 2 && <div className="mx-1 h-px flex-1 bg-white/10" />}
                </div>
              ))}
            </div>
          </>
        )}

        {error && (
          <div className="border-b border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 sm:px-6">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
          {/* Step: Credentials */}
          {step === 'credentials' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-display text-xl font-bold text-white">Credenciais do Painel</h4>
                <p className="mt-1 text-sm text-gray-400">
                  Defina o usuário e senha que você usará para acessar o painel de revenda.
                </p>
              </div>

              <div className="space-y-4">
                <Field label="Username" icon={User}>
                  <input
                    type="text"
                    value={form.resellerUsername}
                    onChange={(e) =>
                      updateForm('resellerUsername', e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 32))
                    }
                    placeholder="seurevenda"
                    className="input-field"
                    autoComplete="username"
                  />
                  <AvailabilityHint status={usernameStatus} />
                </Field>

                <Field label="E-mail da conta" icon={Mail}>
                  <input
                    type="email"
                    value={form.resellerEmail}
                    onChange={(e) => updateForm('resellerEmail', e.target.value)}
                    placeholder="revenda@email.com"
                    className="input-field"
                    autoComplete="email"
                  />
                  <AvailabilityHint status={emailStatus} />
                </Field>

                <Field label="Senha" icon={Lock}>
                  <input
                    type="password"
                    value={form.resellerPassword}
                    onChange={(e) => updateForm('resellerPassword', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="input-field"
                    autoComplete="new-password"
                  />
                </Field>
              </div>

              <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4">
                <p className="text-xs text-gray-400">
                  Após a confirmação do pagamento, suas credenciais serão exibidas aqui e enviadas para o e-mail informado.
                </p>
              </div>
            </div>
          )}

          {/* Step: Payment */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-display text-xl font-bold text-white">Dados de Pagamento</h4>
                <p className="mt-1 text-sm text-gray-400">Informe seus dados para gerar o PIX.</p>
              </div>

              <div className="space-y-4">
                <Field label="Nome completo" icon={User}>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => updateForm('customerName', e.target.value)}
                    placeholder="João Silva"
                    className="input-field"
                  />
                </Field>

                <Field label="E-mail" icon={Mail}>
                  <input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => updateForm('customerEmail', e.target.value)}
                    placeholder="seu@email.com"
                    className="input-field"
                  />
                </Field>

                <Field label="CPF" icon={Shield}>
                  <input
                    type="text"
                    value={form.customerCpf}
                    onChange={(e) => updateForm('customerCpf', formatCpf(e.target.value))}
                    placeholder="000.000.000-00"
                    className="input-field"
                    maxLength={14}
                  />
                </Field>

                <Field label="WhatsApp (opcional)" icon={User}>
                  <input
                    type="text"
                    value={form.customerWhatsapp}
                    onChange={(e) => updateForm('customerWhatsapp', formatPhone(e.target.value))}
                    placeholder="+55 (13) 99999-9999"
                    className="input-field"
                  />
                </Field>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-white">Método de pagamento</p>
                {loadingMethods ? (
                  <div className="flex items-center justify-center py-8 text-gray-400">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Carregando...
                  </div>
                ) : paymentMethods.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum método de pagamento disponível.</p>
                ) : (
                  <div className="grid gap-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={`${method.gateway_id}-${method.type}`}
                        type="button"
                        onClick={() => updateForm('paymentMethod', method)}
                        className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${
                          form.paymentMethod?.gateway_id === method.gateway_id &&
                          form.paymentMethod?.type === method.type
                            ? 'border-brand-500/50 bg-brand-500/10'
                            : 'border-white/[0.08] bg-white/[0.02] hover:border-white/15'
                        }`}
                      >
                        <span className="font-medium text-white">
                          {method.name || paymentMethodLabel(method.type)}
                        </span>
                        {form.paymentMethod?.gateway_id === method.gateway_id &&
                          form.paymentMethod?.type === method.type && (
                            <CheckCircle2 className="h-5 w-5 text-brand-400" />
                          )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Plano selecionado</span>
                  <span className="font-semibold text-white">{plan.name}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-gray-400">Total</span>
                  <span className="font-display text-xl font-bold text-white">{formatCurrency(plan.price)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step: PIX */}
          {step === 'pix' && (
            <div className="space-y-5 text-center">
              <div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-500/30 bg-brand-500/10">
                  <QrCode className="h-7 w-7 text-brand-300" />
                </div>
                <h4 className="font-display text-xl font-bold text-white">Pague via PIX</h4>
                <p className="mt-1 text-sm text-gray-400">
                  Escaneie o QR Code ou copie o código abaixo. A confirmação é automática.
                </p>
              </div>

              {pixData?.qrBase64 ? (
                <div className="mx-auto w-fit rounded-2xl border border-white/10 bg-white p-4">
                  <img src={pixData.qrBase64} alt="QR Code PIX" className="h-48 w-48 sm:h-56 sm:w-56" />
                </div>
              ) : (
                <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                  <QrCode className="h-16 w-16 text-gray-600" />
                </div>
              )}

              {pixData?.copyPaste && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Pix Copia e Cola</p>
                  <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:flex-row sm:items-center">
                    <p className="flex-1 break-all text-left text-xs leading-relaxed text-gray-300 sm:truncate">
                      {pixData.copyPaste}
                    </p>
                    <button
                      onClick={copyPixCode}
                      className="shrink-0 rounded-lg bg-brand-600 p-2 text-white transition hover:bg-brand-500"
                      aria-label="Copiar código PIX"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                {provisioning
                  ? 'Pagamento confirmado! Criando sua conta...'
                  : paymentStatus === 'pending'
                    ? 'Aguardando confirmação do pagamento...'
                    : 'Verificando pagamento...'}
              </div>

              {pollingError && (
                <p className="text-sm text-red-400">{pollingError}</p>
              )}
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>

              <div>
                <h4 className="font-display text-2xl font-bold text-white">Compra Confirmada!</h4>
                <p className="mt-2 text-sm text-gray-400">
                  Suas credenciais de acesso ao painel estão prontas.
                </p>
              </div>

              <div className="space-y-3 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6 text-left">
                <CredentialRow label="Painel" value={credentials?.panel_url ?? veltrixConfig.panelUrl} isLink />
                <CredentialRow label="Username" value={credentials?.username ?? form.resellerUsername} copyable />
                <CredentialRow label="E-mail" value={credentials?.email ?? form.resellerEmail} />
                <CredentialRow label="Senha" value={credentials?.password ?? form.resellerPassword} copyable secret />
              </div>

              <a
                href={credentials?.panel_url ?? veltrixConfig.panelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-3.5"
              >
                <Crown className="h-4 w-4" />
                Acessar Painel de Revenda
              </a>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {step !== 'success' && step !== 'pix' && (
          <div className="flex flex-col-reverse gap-2 border-t border-white/[0.06] px-4 py-3.5 sm:flex-row sm:gap-3 sm:px-6 sm:py-4">
            {step === 'payment' && (
              <button
                onClick={() => setStep('credentials')}
                className="btn-secondary flex-1 py-3"
                disabled={submitting}
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </button>
            )}

            {step === 'credentials' && (
              <button
                onClick={() => {
                  if (validateCredentials()) setStep('payment');
                }}
                className="btn-primary flex-1 py-3"
              >
                Continuar
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {step === 'payment' && (
              <button
                onClick={() => {
                  if (validatePayment()) handleCreatePayment();
                }}
                disabled={submitting || loadingMethods}
                className="btn-primary flex-1 py-3 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Gerar PIX
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="border-t border-white/[0.06] px-4 py-3.5 sm:px-6 sm:py-4">
            <button onClick={onClose} className="btn-secondary w-full py-3">
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-300">
        <Icon className="h-3.5 w-3.5 text-brand-400" />
        {label}
      </label>
      {children}
    </div>
  );
}

function AvailabilityHint({ status }: { status: 'idle' | 'checking' | 'available' | 'taken' }) {
  if (status === 'idle') return null;

  if (status === 'checking') {
    return (
      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
        <Loader2 className="h-3 w-3 animate-spin" /> Verificando...
      </p>
    );
  }

  return (
    <p className={`mt-1 flex items-center gap-1 text-xs ${status === 'available' ? 'text-green-400' : 'text-red-400'}`}>
      {status === 'available' ? (
        <>
          <CheckCircle2 className="h-3 w-3" /> Disponível
        </>
      ) : (
        <>Já está em uso</>
      )}
    </p>
  );
}

function CredentialRow({
  label,
  value,
  copyable,
  secret,
  isLink,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  secret?: boolean;
  isLink?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(!secret);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        {isLink ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="break-all text-sm text-brand-300 hover:underline sm:truncate">
            {value}
          </a>
        ) : (
          <p className="break-all font-mono text-sm text-white sm:truncate">
            {revealed ? value : '••••••••'}
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        {secret && (
          <button
            onClick={() => setRevealed(!revealed)}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <Lock className="h-4 w-4" />
          </button>
        )}
        {copyable && (
          <button
            onClick={handleCopy}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
