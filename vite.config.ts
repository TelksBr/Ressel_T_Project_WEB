import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { panelOriginFromHostname } from './src/lib/domain';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: panelOriginFromHostname('https:', 'localhost'),
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
