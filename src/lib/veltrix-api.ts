import { veltrixConfig } from './config';
import type {
  ApiError,
  AvailabilityResponse,
  CreatePaymentPayload,
  CreateTestPayload,
  CreateTestResponse,
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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
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
        ? 'Falha ao conectar com a API. Verifique se o servidor de desenvolvimento está rodando.'
        : 'Falha ao conectar com a API. Verifique a URL e as permissões CORS.',
      0
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

  if (!response.ok) {
    const errorData = data as ApiError | null;
    const message =
      errorData?.message ||
      errorData?.error ||
      `Erro na API (${response.status})`;
    throw new VeltrixApiError(message, response.status, errorData ?? undefined);
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
  const root = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
  const raw = (root.data ?? root) as Record<string, unknown>;

  return {
    enabled: Boolean(raw.enabled),
    duration_hours: Number(raw.duration_hours ?? 0),
    cooldown_hours: Number(raw.cooldown_hours ?? 0),
    include_v2ray: Boolean(raw.include_v2ray),
    trusted_email_domains: Array.isArray(raw.trusted_email_domains)
      ? (raw.trusted_email_domains as string[])
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
    name: String(raw.name ?? 'Plano'),
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

function normalizePaymentMethods(data: PaymentMethodsResponse): PaymentMethodsResponse {
  if (data.methods) return data;
  if (data.payment_methods) return { methods: data.payment_methods, gateway: data.gateway };
  return data;
}

function extractPixData(data: Record<string, unknown>): PixPaymentData {
  const payment = (data.payment ?? data.data ?? data) as Record<string, unknown>;
  const pix = (payment.pix ?? payment.pix_data ?? payment) as Record<string, unknown>;

  const paymentId = String(
    payment.payment_id ?? payment.id ?? data.payment_id ?? data.id ?? ''
  );

  return {
    payment_id: paymentId,
    order_id: String(payment.order_id ?? data.order_id ?? ''),
    status: String(payment.status ?? data.status ?? 'pending'),
    pix_qr_code: String(pix.qr_code ?? pix.pix_qr_code ?? payment.qr_code ?? ''),
    pix_qr_code_base64: String(
      pix.qr_code_base64 ?? pix.pix_qr_code_base64 ?? payment.qr_code_base64 ?? ''
    ),
    pix_copy_paste: String(
      pix.copy_paste ?? pix.pix_copy_paste ?? pix.emv ?? payment.copy_paste ?? payment.emv ?? ''
    ),
    qr_code: String(pix.qr_code ?? ''),
    qr_code_base64: String(pix.qr_code_base64 ?? ''),
    copy_paste: String(pix.copy_paste ?? pix.emv ?? ''),
    emv: String(pix.emv ?? ''),
    expiration: String(pix.expiration ?? payment.expiration ?? ''),
    amount: Number(payment.amount ?? data.amount ?? 0) || undefined,
  };
}

function extractCredentials(data: PaymentStatusResponse): PaymentStatusResponse['account'] {
  const account = data.account ?? data.reseller ?? data.credentials;
  if (account) {
    return {
      ...account,
      panel_url: account.panel_url ?? account.login_url ?? veltrixConfig.panelUrl,
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
    const data = await request<PaymentMethodsResponse>(slugPath(`/payment-methods${query}`));
    return normalizePaymentMethods(data);
  },

  async checkUsername(username: string): Promise<boolean> {
    const data = await request<AvailabilityResponse>(
      `/public/reseller-sales/check-username?username=${encodeURIComponent(username)}`
    );
    return data.available ?? false;
  },

  async checkEmail(email: string): Promise<boolean> {
    const data = await request<AvailabilityResponse>(
      `/public/reseller-sales/check-email?email=${encodeURIComponent(email)}`
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
    const data = await request<PaymentStatusResponse>(
      `/public/payment/${encodeURIComponent(paymentId)}/status`
    );
    return {
      ...data,
      account: extractCredentials(data),
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
      success: data.success ?? true,
      message: data.message ?? 'Teste criado! Verifique sua caixa de entrada.',
    };
  },
};

export { VeltrixApiError };
