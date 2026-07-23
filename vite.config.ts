import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Browser usa /api; o proxy precisa de URL absoluta do painel (não /api relativo).
  const panelOrigin = (env.VITE_VELTRIX_PANEL_URL ?? 'https://painel.reselltproject.shop').replace(
    /\/$/,
    ''
  );
  const rawBase = env.VITE_VELTRIX_API_BASE_URL ?? '/api';
  const apiTarget =
    !rawBase || rawBase === '/api' || rawBase.startsWith('/')
      ? panelOrigin
      : rawBase.replace(/\/api\/?$/, '');

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
