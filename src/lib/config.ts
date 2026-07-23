import { resolvePanelOrigin } from './domain';

/** Slug da página de vendas desta instalação */
const SALES_SLUG = '157487657359';

/**
 * Token público da API Veltrix (projetado para uso no client).
 * Override opcional via VITE_VELTRIX_PUBLIC_API_TOKEN no .env local.
 */
const PUBLIC_API_TOKEN =
  import.meta.env.VITE_VELTRIX_PUBLIC_API_TOKEN ??
  'veltrix_pub_b79a85096caa4486457c3ac6544ccaa53fa47a2185bef524';

/** Sempre same-origin: proxy Vite (dev) ou Cloudflare Function (prod) — sem CORS */
export const API_BASE = '/api';

export const veltrixConfig = {
  get apiBaseUrl() {
    return API_BASE;
  },
  get panelUrl() {
    return resolvePanelOrigin();
  },
  salesSlug: SALES_SLUG,
  publicApiToken: PUBLIC_API_TOKEN,
  get isConfigured() {
    return Boolean(PUBLIC_API_TOKEN);
  },
} as const;
