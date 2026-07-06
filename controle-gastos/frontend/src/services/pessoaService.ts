import api from './api';
import type { Pessoa } from '../types';

// Função auxiliar para extrair o array de uma resposta com $values
function extractArray(data: any): any[] {
  if (data && typeof data === 'object' && '$values' in data) {
    return data.$values;
  }
  return data;
}

export const pessoaService = {
  async listar(): Promise<Pessoa[]> {
    const response = await api.get('/Pessoas');
    return extractArray(response.data);
  },

  async criar(pessoa: Omit<Pessoa, 'id'>): Promise<Pessoa> {
    const response = await api.post('/Pessoas', pessoa);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/Pessoas/${id}`);
  },
};
