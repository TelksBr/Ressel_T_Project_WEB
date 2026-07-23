/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VELTRIX_API_BASE_URL: string;
  readonly VITE_VELTRIX_SALES_SLUG: string;
  readonly VITE_VELTRIX_PUBLIC_API_TOKEN: string;
  readonly VITE_VELTRIX_PANEL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
