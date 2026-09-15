import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'REACT_APP_']);
  const processEnv = {};
  for (const [key, val] of Object.entries(env)) {
    processEnv[`process.env.${key}`] = JSON.stringify(val);
  }

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: false,
    },
    envPrefix: ['VITE_', 'REACT_APP_'],
    define: {
      ...processEnv,
      'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
    },
  };
});
