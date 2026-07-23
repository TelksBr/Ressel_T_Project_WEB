const apiBase = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_VELTRIX_API_BASE_URL ?? 'https://painel.reselltproject.shop/api').replace(
      /\/$/,
      ''
    );
const salesSlug = import.meta.env.VITE_VELTRIX_SALES_SLUG ?? '157487657359';
const publicApiToken = import.meta.env.VITE_VELTRIX_PUBLIC_API_TOKEN ?? '';
const panelUrl = import.meta.env.VITE_VELTRIX_PANEL_URL ?? 'https://painel.reselltproject.shop';

export const veltrixConfig = {
  apiBaseUrl: apiBase,
  salesSlug,
  publicApiToken,
  panelUrl,
  isConfigured: Boolean(publicApiToken),
} as const;
