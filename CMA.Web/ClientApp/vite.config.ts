import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.API_KEY)
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
        '@': path.resolve(new URL('.', import.meta.url).pathname, '.'),
      }
    },
  }
});