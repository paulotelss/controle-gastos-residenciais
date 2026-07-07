import axios from 'axios';

/**
 * configuração base do cliente HTTP para comunicação com o backend.
 * 
 * - baseURL: '/api' utiliza o proxy configurado no Vite (vite.config.ts),
 *   que redireciona as requisições para o backend (ex: http://localhost:5091).
 * - headers: Define o Content-Type padrão como application/json.
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;