import { t } from '../lib/i18n';
import { useEffect, useRef, useState } from 'react';
import { veltrixApi } from '../lib/veltrix-api';
import type {
  PaymentStatusResponse,
  ResellerCredentials,
} from '../types/veltrix';

interface UsePaymentPollingOptions {
  paymentId: string | null;
  enabled: boolean;
  intervalMs?: number;
  maxAttempts?: number;
  onApproved?: (credentials: ResellerCredentials | undefined) => void;
  onRejected?: (message?: string) => void;
}

export function usePaymentPolling({
  paymentId,
  enabled,
  intervalMs = 4000,
  maxAttempts = 90,
  onApproved,
  onRejected,
}: UsePaymentPollingOptions) {
  const [status, setStatus] =
    useState<PaymentStatusResponse['status']>('pending');
  const [provisioning, setProvisioning] = useState(false);
  const [credentials, setCredentials] = useState<
    ResellerCredentials | undefined
  >();
  const [error, setError] = useState<string | null>(null);
  const attemptsRef = useRef(0);
  const callbacksRef = useRef({ onApproved, onRejected });

  callbacksRef.current = { onApproved, onRejected };

  useEffect(() => {
    if (!enabled || !paymentId) return;

    attemptsRef.current = 0;
    setStatus('pending');
    setProvisioning(false);
    setCredentials(undefined);
    setError(null);

    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;

      try {
        const result = await veltrixApi.getPaymentStatus(paymentId);
        if (cancelled) return;

        setStatus(result.status);
        setProvisioning(Boolean(result.provisioning));

        if (result.status === 'approved') {
          if (result.provisioning) return;

          setCredentials(result.account);
          callbacksRef.current.onApproved?.(result.account);
          return;
        }

        if (result.status === 'rejected' || result.status === 'cancelled') {
          callbacksRef.current.onRejected?.(result.message);
          return;
        }

        attemptsRef.current += 1;
        if (attemptsRef.current >= maxAttempts) {
          setError(t('Tempo esgotado aguardando confirmação do pagamento.'));
          return;
        }

        setTimeout(poll, intervalMs);
      } catch (err) {
        if (cancelled) return;
        attemptsRef.current += 1;

        if (attemptsRef.current >= maxAttempts) {
          setError(
            err instanceof Error
              ? err.message
              : t('Erro ao verificar pagamento.'),
          );
          return;
        }

        setTimeout(poll, intervalMs);
      }
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [paymentId, enabled, intervalMs, maxAttempts]);

  return { status, provisioning, credentials, error };
}
