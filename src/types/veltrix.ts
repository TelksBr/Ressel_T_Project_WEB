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

export interface PayerDocumentConfig {
  type: string;
  label: string;
  min_len?: number;
  max_len?: number;
  charset?: string;
}

export interface PaymentGateway {
  id: number;
  name?: string;
  provider?: string;
  region?: string;
  currency?: string;
  mp_public_key?: string;
  mp_credential_environment?: string;
  paypal_client_id?: string;
  paypal_environment?: string;
  payer_document?: PayerDocumentConfig;
  payer_document_rules?: Record<string, string>;
}

export interface BackendInstallmentOption {
  installments?: number;
  installment?: number;
  installment_amount?: number;
  amount?: number;
  total_amount?: number;
  total?: number;
  installment_rate?: number;
  rate?: number;
  recommended_message?: string;
  message?: string;
}

export interface PaymentMethod {
  id: number;
  gateway_id: number;
  type: string;
  name: string;
  method_id?: string;
  description?: string;
  min_amount?: string | number;
  max_amount?: string | number;
  gateway_provider?: string;
  selection_key?: string;
  gateway?: PaymentGateway;
  installments?: BackendInstallmentOption[];
  payer_costs?: BackendInstallmentOption[];
}

export interface PaymentMethodsResponse {
  success?: boolean;
  methods?: PaymentMethod[];
  payment_methods?: PaymentMethod[];
  gateways?: PaymentGateway[];
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
  customer_cpf?: string;
  customer_whatsapp?: string;
  identification_type?: string;
  reseller_username: string;
  reseller_email: string;
  reseller_password: string;
  card_token?: string;
  mp_payment_method_id?: string;
  installments?: number;
  issuer_id?: string;
  issuer_verified?: boolean;
  cardholder_name?: string;
  mp_public_key_used?: string;
  mp_device_session_id?: string;
  return_url?: string;
  failure_url?: string;
  pending_url?: string;
  coupon_code?: string;
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

export interface PixDetails {
  qr_code_base64?: string;
  qr_code_text?: string;
  expires_at?: string;
}

export interface CardDetails {
  status?: string;
  status_detail?: string;
}

export interface TicketDetails {
  payment_url?: string;
  barcode?: string;
  expires_at?: string;
}

export interface WalletDetails {
  preference_id?: string;
  init_point?: string;
  sandbox_init_point?: string;
  checkout_url?: string;
  order_id?: string;
}

export interface PaypalDetails {
  order_id?: string;
  client_id?: string;
  environment?: string;
}

export interface PaymentResult extends PixPaymentData {
  success: boolean;
  payment_method?: string;
  db_payment_id?: number;
  payment_url?: string;
  message?: string;
  pix?: PixDetails;
  card?: CardDetails;
  ticket?: TicketDetails;
  wallet?: WalletDetails;
  paypal?: PaypalDetails;
}

export interface ResellerCredentials {
  username?: string;
  password?: string;
  email?: string;
  panel_url?: string;
  login_url?: string;
}

export interface PaymentStatusResponse {
  status: 'pending' | 'in_process' | 'approved' | 'rejected' | 'cancelled' | string;
  provisioning?: boolean;
  payment_id?: string;
  order_id?: string;
  account?: ResellerCredentials;
  reseller?: ResellerCredentials;
  credentials?: ResellerCredentials;
  message?: string;
}

export interface CouponValidationData {
  code: string;
  coupon_code?: string;
  discount_type: 'percent' | 'fixed' | string;
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  currency?: string;
}

export interface CouponValidationResponse {
  success: boolean;
  message?: string;
  data?: CouponValidationData;
}

export interface PaypalCaptureResponse {
  success: boolean;
  status: 'approved' | 'pending' | string;
  payment_id: string;
  message?: string;
}

export interface ApiError {
  success?: boolean;
  message?: string;
  error?: string;
  error_type?: string;
  errors?: Record<string, string[] | string>;
}

export type PurchaseStep =
  | 'credentials'
  | 'payment'
  | 'pix'
  | 'checkout'
  | 'success';

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
  couponCode?: string;
  // Credit card fields
  cardNumber?: string;
  cardholderName?: string;
  cardExpMonth?: string;
  cardExpYear?: string;
  cardCvv?: string;
  installments?: number;
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
