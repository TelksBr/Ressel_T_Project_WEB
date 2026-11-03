import { getLocale, t } from './i18n';
import { veltrixConfig } from './config';
import type {
  ApiError,
  AvailabilityResponse,
  CreatePaymentPayload,
  CreateTestPayload,
  CreateTestResponse,
  PaymentGateway,
  PaymentMethod,
  PaymentMethodsResponse,
  PaymentStatusResponse,
  PixPaymentData,
  ResellerPlan,
  TestConfig,
} from '../types/veltrix';

class VeltrixApiError extends Error {
  status: number;
  details?: ApiError;

  constructor(message: string, status: number, details?: ApiError) {
    super(message);
    this.name = 'VeltrixApiError';
    this.status = status;
    this.details = details;
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function firstString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && value.length > 0) return value;
    if (typeof value === 'number' && Number.isFinite(value))
      return String(value);
  }
  return '';
}

function extractApiErrorMessage(data: unknown, fallback: string): string {
  const obj = asRecord(data);
  const nested = asRecord(obj.data);
  const fieldErrors = obj.errors;

  if (fieldErrors && typeof fieldErrors === 'object') {
    const parts = Object.values(fieldErrors as Record<string, unknown>)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .map((value) => firstString(value))
      .filter(Boolean);
    if (parts.length) return parts.join(' ');
  }

  return firstString(obj.message, obj.error, nested.message) || fallback;
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message.trim()) return err.message;
  return fallback;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Accept-Language': getLocale(),
    ...(options.headers as Record<string, string>),
  };

  if (veltrixConfig.publicApiToken) {
    headers['X-Public-Api-Token'] = veltrixConfig.publicApiToken;
  }

  let response: Response;

  try {
    response = await fetch(`${veltrixConfig.apiBaseUrl}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new VeltrixApiError(
      import.meta.env.DEV
        ? t(
            'Falha ao conectar com a API. Verifique se o servidor de desenvolvimento está rodando.',
          )
        : t(
            'Falha ao conectar com a API. Verifique a URL e as permissões CORS.',
          ),
      0,
    );
  }

  const text = await response.text();
  let data: T | ApiError | null = null;

  if (text) {
    try {
      data = JSON.parse(text) as T | ApiError;
    } catch {
      if (!response.ok) {
        throw new VeltrixApiError(text || response.statusText, response.status);
      }
    }
  }

  const failure =
    !response.ok ||
    (data !== null &&
      typeof data === 'object' &&
      asRecord(data).success === false);

  if (failure) {
    const fallback = response.ok
      ? t('Não foi possível concluir a operação.')
      : t('Erro na API ({status})', { status: response.status });
    throw new VeltrixApiError(
      extractApiErrorMessage(data, fallback),
      response.status,
      (data as ApiError | null) ?? undefined,
    );
  }

  if (data === null && text && !text.startsWith('<')) {
    throw new VeltrixApiError(t('Resposta inválida da API.'), response.status);
  }

  return (data ?? ({} as T)) as T;
}

function slugPath(suffix: string) {
  return `/public/reseller-sales/${veltrixConfig.salesSlug}${suffix}`;
}

function testSlugPath(suffix: string) {
  return `/public/test/${veltrixConfig.salesSlug}${suffix}`;
}

function normalizeTestConfig(data: unknown): TestConfig {
  const root = (data && typeof data === 'object' ? data : {}) as Record<
    string,
    unknown
  >;
  const raw = (root.data ?? root) as Record<string, unknown>;

  return {
    enabled: Boolean(raw.enabled),
    duration_hours: Number(raw.duration_hours ?? 0),
    cooldown_hours: Number(raw.cooldown_hours ?? 0),
    include_v2ray: Boolean(raw.include_v2ray),
    trusted_email_domains: Array.isArray(raw.trusted_email_domains)
      ? (raw.trusted_email_domains as unknown[]).filter(
          (d): d is string => typeof d === 'string' && d.length > 0,
        )
      : [],
    seller: raw.seller as TestConfig['seller'],
  };
}

function normalizePlan(raw: Record<string, unknown>): ResellerPlan | null {
  const id = Number(raw.id);
  if (!id) return null;

  const isActive = raw.is_active;
  if (isActive === 0 || isActive === false) return null;

  const type = String(raw.type ?? raw.plan_type ?? '');

  return {
    id,
    name: String(raw.name ?? t('Plano')),
    description: raw.description ? String(raw.description) : undefined,
    price: Number(raw.price ?? 0),
    duration_days: Number(raw.duration_days) || undefined,
    login_limit: Number(raw.login_limit) || undefined,
    credit_amount: Number(raw.credits_amount ?? raw.credit_amount) || undefined,
    plan_type: type,
    min_quantity: Number(raw.min_quantity) || undefined,
  };
}

function normalizePlans(data: unknown): ResellerPlan[] {
  let plans: unknown[] = [];

  if (Array.isArray(data)) {
    plans = data;
  } else if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.plans)) plans = obj.plans;
    else if (Array.isArray(obj.data)) plans = obj.data;
  }

  return plans
    .map((plan) => normalizePlan(plan as Record<string, unknown>))
    .filter((plan): plan is ResellerPlan => plan !== null);
}

function normalizePaymentMethod(
  raw: Record<string, unknown>,
): PaymentMethod | null {
  const gateway = asRecord(raw.gateway);
  const gatewayId = Number(raw.gateway_id ?? gateway.id ?? 0);
  const methodId = firstString(raw.method_id);
  const genericType = firstString(raw.type);
  const type = methodId || (genericType === 'instant' ? 'pix' : genericType);

  if (!gatewayId || !type) return null;

  return {
    id: Number(raw.id ?? gatewayId),
    gateway_id: gatewayId,
    type,
    name: firstString(raw.name, type),
    method_id: methodId || type,
    selection_key: firstString(raw.selection_key) || `${gatewayId}:${type}`,
    gateway: Object.keys(gateway).length
      ? (gateway as PaymentGateway)
      : undefined,
  };
}

function normalizePaymentMethods(data: unknown): PaymentMethodsResponse {
  const root = asRecord(data);
  const inner = asRecord(root.data);
  const rawMethods =
    inner.methods ??
    inner.payment_methods ??
    root.methods ??
    root.payment_methods;
  const methods = Array.isArray(rawMethods)
    ? rawMethods
        .map((item) =>
          item && typeof item === 'object'
            ? normalizePaymentMethod(asRecord(item))
            : null,
        )
        .filter((method): method is PaymentMethod => method !== null)
    : [];

  return {
    methods,
    gateway: (inner.gateway ?? root.gateway) as PaymentGateway | undefined,
  };
}

function extractPixData(data: Record<string, unknown>): PixPaymentData {
  const nested = asRecord(data.data);
  const payment = asRecord(data.payment);
  const source = { ...data, ...nested, ...payment };
  const pix = { ...asRecord(source.pix_data), ...asRecord(source.pix) };

  const paymentId = firstString(
    source.payment_id,
    source.id,
    nested.payment_id,
    payment.payment_id,
  );
  const copyPaste = firstString(
    pix.qr_code_text,
    pix.copy_paste,
    pix.pix_copy_paste,
    pix.emv,
    source.qr_code_text,
    source.copy_paste,
    source.emv,
  );
  const qrBase64 = firstString(
    pix.qr_code_base64,
    pix.pix_qr_code_base64,
    source.qr_code_base64,
  );

  return {
    payment_id: paymentId,
    order_id: firstString(source.order_id),
    status: firstString(source.status) || 'pending',
    pix_qr_code: firstString(pix.qr_code, pix.pix_qr_code, source.qr_code),
    pix_qr_code_base64: qrBase64,
    pix_copy_paste: copyPaste,
    qr_code: firstString(pix.qr_code, pix.qr_code_text),
    qr_code_base64: qrBase64,
    copy_paste: copyPaste,
    emv: firstString(pix.emv, copyPaste),
    expiration: firstString(
      pix.expires_at,
      pix.expiration,
      source.expires_at,
      source.expiration,
    ),
    amount: Number(source.amount ?? 0) || undefined,
  };
}

function extractCredentials(
  data: PaymentStatusResponse,
): PaymentStatusResponse['account'] {
  const nested = asRecord(
    (data as unknown as { data?: unknown }).data,
  ) as PaymentStatusResponse;
  const account =
    data.account ??
    data.reseller ??
    data.credentials ??
    nested.account ??
    nested.reseller ??
    nested.credentials;

  if (account) {
    return {
      ...account,
      panel_url:
        account.panel_url ?? account.login_url ?? veltrixConfig.panelUrl,
    };
  }
  return undefined;
}

export const veltrixApi = {
  async getResellerPlans(): Promise<ResellerPlan[]> {
    const data = await request<unknown>(slugPath('/plans'));
    return normalizePlans(data);
  },

  async getPaymentMethods(amount?: number): Promise<PaymentMethodsResponse> {
    const query = amount ? `?amount=${amount}` : '';
    const data = await request<PaymentMethodsResponse>(
      slugPath(`/payment-methods${query}`),
    );
    return normalizePaymentMethods(data);
  },

  async checkUsername(username: string): Promise<boolean> {
    const data = await request<AvailabilityResponse>(
      `/public/reseller-sales/check-username?username=${encodeURIComponent(username)}`,
    );
    return data.available ?? false;
  },

  async checkEmail(email: string): Promise<boolean> {
    const data = await request<AvailabilityResponse>(
      `/public/reseller-sales/check-email?email=${encodeURIComponent(email)}`,
    );
    return data.available ?? false;
  },

  async createPayment(payload: CreatePaymentPayload): Promise<PixPaymentData> {
    const data = await request<Record<string, unknown>>(slugPath('/payment'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return extractPixData(data);
  },

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const data = await request<Record<string, unknown>>(
      `/public/payment/${encodeURIComponent(paymentId)}/status`,
    );
    const nested = asRecord(data.data);
    const payload = (
      nested.status ? { ...data, ...nested } : data
    ) as PaymentStatusResponse;

    return {
      ...payload,
      status: String(payload.status ?? nested.status ?? 'pending'),
      account: extractCredentials(payload),
    };
  },

  async cancelPayment(paymentId: string): Promise<void> {
    await request(`/public/payment/${encodeURIComponent(paymentId)}/cancel`, {
      method: 'POST',
    });
  },

  async getTestConfig(): Promise<TestConfig> {
    const data = await request<unknown>(testSlugPath('/config'));
    return normalizeTestConfig(data);
  },

  async createTest(payload: CreateTestPayload): Promise<CreateTestResponse> {
    const data = await request<CreateTestResponse>(testSlugPath('/create'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email.trim(),
        ...(payload.phone ? { phone: payload.phone } : {}),
        include_v2ray: payload.include_v2ray ?? false,
      }),
    });

    return {
      success: data?.success ?? true,
      message:
        data?.message ?? t('Teste criado! Verifique sua caixa de entrada.'),
    };
  },
};

export { VeltrixApiError };
