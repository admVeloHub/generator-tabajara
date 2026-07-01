/** vite.config v1.0.0 — porta 8050, host LAN, middleware Gemini em dev */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleGenerateQuestionsRequest } from './server/generateQuestions.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'gemini-api-dev',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url !== '/api/generate-questions' || req.method !== 'POST') {
              return next();
            }

            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', async () => {
              try {
                const parsed = body ? JSON.parse(body) : {};
                const result = await handleGenerateQuestionsRequest(parsed, {
                  apiKey: env.GEMINI_API_KEY || process.env.GEMINI_API_KEY,
                  model: env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-2.0-flash',
                });
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = result.ok ? 200 : result.status;
                res.end(JSON.stringify(result.body));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: err.message || 'Erro interno' }));
              }
            });
          });
        },
      },
    ],
    server: {
      port: 8050,
      host: true,
      strictPort: true,
    },
    preview: {
      port: 8050,
      host: true,
    },
  };
});
