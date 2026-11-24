
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development/production)
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // STRICT: Only load from environment variable, no hardcoded fallbacks
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  return {
    plugins: [react()],
    define: {
      // Define 'process.env.GEMINI_API_KEY' globally for the app to use.
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
    },
  };
});
