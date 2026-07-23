/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VELTRIX_PUBLIC_API_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
