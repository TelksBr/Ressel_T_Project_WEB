/**
 * Utilitário para tokenização de cartão e consulta de parcelas via Mercado Pago SDK v2.
 */

let mpScriptPromise: Promise<void> | null = null;

export function loadMercadoPagoScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).MercadoPago) return Promise.resolve();
  if (mpScriptPromise) return mpScriptPromise;

  mpScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="mercadopago.com/js/v2"]',
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Falha ao carregar o SDK do Mercado Pago.')),
      );
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Falha ao carregar o SDK do Mercado Pago.'));
    document.head.appendChild(script);
  });

  return mpScriptPromise;
}

export interface CardTokenParams {
  publicKey: string;
  cardNumber: string;
  cardholderName: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  identificationType?: string;
  identificationNumber?: string;
}

export interface CardTokenResult {
  token: string;
  paymentMethodId: string;
}

export interface MpInstallmentOption {
  installments: number;
  installmentAmount: number;
  totalAmount: number;
  installmentRate?: number;
  hasInterest?: boolean;
  recommendedMessage: string;
}

export interface MpInstallmentsResult {
  options: MpInstallmentOption[];
  paymentMethodId?: string;
  issuerId?: string;
}

export async function getMpInstallments(
  publicKey: string,
  amount: number,
  bin: string,
): Promise<MpInstallmentsResult> {
  const cleanBin = bin.replace(/\D/g, '').slice(0, 6);
  if (cleanBin.length < 6) return { options: [] };

  try {
    await loadMercadoPagoScript();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MP = (window as any).MercadoPago;
    if (!MP) return { options: [] };

    const mp = new MP(publicKey);
    const res = await mp.getInstallments({
      amount: String(amount),
      bin: cleanBin,
    });

    const first = res?.[0];
    const payerCosts = first?.payer_costs;
    const paymentMethodId = first?.payment_method_id;
    const issuerId = first?.issuer?.id ? String(first.issuer.id) : undefined;

    if (Array.isArray(payerCosts)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options: MpInstallmentOption[] = payerCosts.map((p: any) => {
        const installmentRate = Number(p.installment_rate ?? 0);
        const totalAmount = Number(p.total_amount ?? 0);
        const installments = Number(p.installments ?? 1);
        const hasInterest =
          installmentRate > 0 ||
          (installments > 1 && totalAmount > amount + 0.05);

        return {
          installments,
          installmentAmount: Number(p.installment_amount ?? 0),
          totalAmount,
          installmentRate,
          hasInterest,
          recommendedMessage: String(
            p.recommended_message || `${installments}x`,
          ),
        };
      });

      return {
        options,
        paymentMethodId,
        issuerId,
      };
    }
  } catch (e) {
    console.warn('Erro ao consultar parcelas no Mercado Pago:', e);
  }
  return { options: [] };
}

export async function createMpCardToken(
  params: CardTokenParams,
): Promise<CardTokenResult> {
  await loadMercadoPagoScript();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MP = (window as any).MercadoPago;
  if (!MP) {
    throw new Error('SDK do Mercado Pago não disponível.');
  }

  const mp = new MP(params.publicKey);

  const cleanNumber = params.cardNumber.replace(/\D/g, '');
  const bin = cleanNumber.slice(0, 6);

  let paymentMethodId = 'credit_card';
  try {
    const methodsResponse = await mp.getPaymentMethods({ bin });
    if (methodsResponse?.results?.[0]?.id) {
      paymentMethodId = methodsResponse.results[0].id;
    }
  } catch {
    // fallback se falhar a identificação pelo bin
  }

  const expMonth = params.cardExpirationMonth.replace(/\D/g, '').padStart(2, '0');
  let expYear = params.cardExpirationYear.replace(/\D/g, '');
  if (expYear.length === 2) {
    expYear = `20${expYear}`;
  }

  const cardToken = await mp.createCardToken({
    cardNumber: cleanNumber,
    cardholderName: params.cardholderName.trim(),
    cardExpirationMonth: expMonth,
    cardExpirationYear: expYear,
    securityCode: params.securityCode.trim(),
    identificationType: params.identificationType || 'CPF',
    identificationNumber: params.identificationNumber
      ? params.identificationNumber.replace(/\D/g, '')
      : undefined,
  });

  if (!cardToken?.id) {
    throw new Error('Não foi possível validar o cartão com o Mercado Pago.');
  }

  return {
    token: cardToken.id,
    paymentMethodId,
  };
}
