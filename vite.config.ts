import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { panelOriginFromHostname } from './src/lib/domain';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const panelUrl =
    env.VITE_VELTRIX_PANEL_URL ||
    panelOriginFromHostname('https:', 'localhost');

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/api': {
          target: panelUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
