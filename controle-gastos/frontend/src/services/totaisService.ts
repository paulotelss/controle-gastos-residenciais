import api from './api';
import type { TotaisResponse } from '../types';

function extractArray(data: any): any {
  // O totais tem estrutura aninhada, extraímos o array de totaisPorPessoa
  if (data && typeof data === 'object' && 'totaisPorPessoa' in data) {
    if (data.totaisPorPessoa && typeof data.totaisPorPessoa === 'object' && '$values' in data.totaisPorPessoa) {
      data.totaisPorPessoa = data.totaisPorPessoa.$values;
    }
  }
  return data;
}

export const totaisService = {
  async obter(): Promise<TotaisResponse> {
    const response = await api.get('/Totais');
    return extractArray(response.data);
  },
};
