export interface ResellerPlan {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration_days?: number;
  login_limit?: number;
  credit_amount?: number;
  plan_type?: string;
  min_quantity?: number;
  features?: string[];
  is_featured?: boolean;
}

export interface PaymentGateway {
  id: number;
  name?: string;
  provider?: string;
  region?: string;
  currency?: string;
}

export interface PaymentMethod {
  id: number;
  gateway_id: number;
  type: 'pix' | 'credit_card' | 'cash' | string;
  name: string;
  method_id?: string;
  selection_key?: string;
  gateway?: PaymentGateway;
}

export interface PaymentMethodsResponse {
  success?: boolean;
  methods?: PaymentMethod[];
  payment_methods?: PaymentMethod[];
  gateway?: PaymentGateway;
  data?: {
    methods?: PaymentMethod[];
    payment_methods?: PaymentMethod[];
    gateways?: PaymentGateway[];
    gateway?: PaymentGateway;
  };
}

export interface AvailabilityResponse {
  available: boolean;
  message?: string;
}

export interface CreatePaymentPayload {
  plan_id: number;
  gateway_id: number;
  payment_method_type: string;
  customer_name: string;
  customer_email: string;
  customer_cpf: string;
  customer_whatsapp?: string;
  identification_type?: string;
  reseller_username: string;
  reseller_email: string;
  reseller_password: string;
}

export interface PixPaymentData {
  payment_id: string;
  order_id?: string;
  status?: string;
  pix_qr_code?: string;
  pix_qr_code_base64?: string;
  pix_copy_paste?: string;
  qr_code?: string;
  qr_code_base64?: string;
  copy_paste?: string;
  emv?: string;
  expiration?: string;
  amount?: number;
}

export interface ResellerCredentials {
  username?: string;
  password?: string;
  email?: string;
  panel_url?: string;
  login_url?: string;
}

export interface PaymentStatusResponse {
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | string;
  provisioning?: boolean;
  payment_id?: string;
  order_id?: string;
  account?: ResellerCredentials;
  reseller?: ResellerCredentials;
  credentials?: ResellerCredentials;
  message?: string;
}

export interface ApiError {
  success?: boolean;
  message?: string;
  error?: string;
  error_type?: string;
  errors?: Record<string, string[] | string>;
}

export type PurchaseStep = 'plan' | 'credentials' | 'payment' | 'pix' | 'success';

export interface PurchaseFormData {
  plan: ResellerPlan | null;
  resellerUsername: string;
  resellerEmail: string;
  resellerPassword: string;
  customerName: string;
  customerEmail: string;
  customerCpf: string;
  customerWhatsapp: string;
  paymentMethod: PaymentMethod | null;
}

export interface TestConfig {
  enabled: boolean;
  duration_hours: number;
  cooldown_hours: number;
  include_v2ray: boolean;
  trusted_email_domains: string[];
  seller?: {
    name: string;
    slug: string;
  };
}

export interface CreateTestPayload {
  email: string;
  phone?: string;
  include_v2ray?: boolean;
}

export interface CreateTestResponse {
  success?: boolean;
  message: string;
}
