import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const perplexityKey = env.VITE_PERPLEXITY_API_KEY || env.PERPLEXITY_API_KEY || env.API_KEY || '';
  return {
    plugins: [react()],
    define: {
      'process.env.PERPLEXITY_API_KEY': JSON.stringify(perplexityKey),
    },
    server: {
      port: 3001,
      host: '0.0.0.0',
    },
    build: {
      outDir: '../wwwroot',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
