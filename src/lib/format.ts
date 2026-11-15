import { getLocale, t } from './i18n';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(getLocale(), {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatCpf(value: string): string {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatPhone(value: string): string {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `+${digits.slice(0, 2)} (${digits.slice(2)}`;
  if (digits.length <= 9)
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4)}`;
  return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
}

export function stripDigits(value: string): string {
  if (!value) return '';
  return value.replace(/\D/g, '');
}

export function isValidCpf(cpf: string): boolean {
  const digits = stripDigits(cpf);
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10) check = 0;
  return check === Number(digits[10]);
}

/**
 * Gera um CPF matematicamente válido aleatório (com dígitos verificadores mod11 reais).
 * Permite que o cliente conclua o checkout sem precisar fornecer o CPF real.
 */
export function generateRandomCpf(formatted: boolean = true): string {
  const randomDigit = () => Math.floor(Math.random() * 10);
  let digits: number[] = [];

  while (true) {
    digits = Array.from({ length: 9 }, () => randomDigit());
    if (!digits.every((d) => d === digits[0])) break;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i);
  let check1 = (sum * 10) % 11;
  if (check1 === 10) check1 = 0;
  digits.push(check1);

  sum = 0;
  for (let i = 0; i < 10; i++) sum += digits[i] * (11 - i);
  let check2 = (sum * 10) % 11;
  if (check2 === 10) check2 = 0;
  digits.push(check2);

  const raw = digits.join('');
  return formatted ? formatCpf(raw) : raw;
}

export function formatCardNumber(value: string): string {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatCardExpiry(value: string): string {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function isValidEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isTrustedEmailDomain(
  email: string | null | undefined,
  trustedDomains: string[],
): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  const domain = trimmed.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  if (trustedDomains.length === 0) return isValidEmail(trimmed);

  return trustedDomains
    .filter((trusted): trusted is string => Boolean(trusted))
    .some(
      (trusted) =>
        domain === trusted.toLowerCase() ||
        domain.endsWith(`.${trusted.toLowerCase()}`),
    );
}

export function paymentMethodLabel(type: string, name?: string): string {
  if (name && name.trim()) return name;
  const normalized = (type || '').toLowerCase();
  const labels: Record<string, string> = {
    pix: 'PIX',
    instant: 'PIX',
    credit_card: t('Cartão de Crédito'),
    card: t('Cartão de Crédito'),
    paypal: 'PayPal',
    account_money: 'Mercado Pago (Saldo / Conta)',
    wallet: t('Carteira Digital'),
    cash: t('Dinheiro / Manual'),
    ticket: t('Boleto / Ticket'),
    oxxo: 'OXXO',
    paycash: 'PayCash',
    boleto: t('Boleto Bancário'),
    rapipago: 'Rapipago',
  };
  return labels[normalized] ?? type;
}
