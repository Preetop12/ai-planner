import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/nvidia-api': {
            target: 'https://integrate.api.nvidia.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/nvidia-api/, ''),
            secure: true,
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.VITE_NVIDIA_API_KEY),
        'import.meta.env.VITE_NVIDIA_API_KEY': JSON.stringify(env.VITE_NVIDIA_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
