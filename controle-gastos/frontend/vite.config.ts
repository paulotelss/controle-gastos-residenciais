import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Configuração do Vite para o frontend React.
 * 
 * Principais funcionalidades:
 * - Plugin React para suporte a JSX, Fast Refresh, etc.
 * - Proxy para redirecionar requisições /api para o backend durante o desenvolvimento.
 * 
 * O proxy é essencial para:
 * - Evitar problemas de CORS (Cross-Origin Resource Sharing).
 * - Permitir que o frontend se comunique com o backend sem precisar
 *   saber a URL exata do servidor (funciona tanto localmente quanto no Codespace).
 * - Manter a baseURL do axios como '/api' (caminho relativo).
 */
export default defineConfig({
  // Plugins do Vite (React para suporte a JSX e Fast Refresh)
  plugins: [react()],

  // Configurações do servidor de desenvolvimento
  server: {
    proxy: {
      // Redireciona todas as requisições com caminho iniciando em /api
      '/api': {
        target: 'http://localhost:5091', // URL do backend (porta 5091)
        changeOrigin: true,              // Altera a origem da requisição para o target
        secure: false,                   // Aceita conexões HTTP (sem HTTPS)
      }
    }
  }
})