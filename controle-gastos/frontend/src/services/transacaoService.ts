import api from './api';
import type { Transacao } from '../types';

function extractArray(data: any): any[] {
  if (data && typeof data === 'object' && '$values' in data) {
    return data.$values;
  }
  return data;
}

export const transacaoService = {
  async listar(): Promise<Transacao[]> {
    const response = await api.get('/Transacoes');
    return extractArray(response.data);
  },

  async criar(transacao: Omit<Transacao, 'id'>): Promise<Transacao> {
    const response = await api.post('/Transacoes', transacao);
    return response.data;
  },
};
