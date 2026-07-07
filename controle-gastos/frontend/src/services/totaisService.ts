import api from './api';
import type { TotaisResponse } from '../types';

/**
 * Função auxiliar para extrair o array interno da propriedade 'totaisPorPessoa'.
 * O backend retorna a estrutura com '$values' aninhado. Esta função desempacota
 * o array interno e mantém o restante da estrutura intacta.
 */
function extractArray(data: any): any {
  // O totais tem estrutura aninhada, extraímos o array de totaisPorPessoa
  if (data && typeof data === 'object' && 'totaisPorPessoa' in data) {
    if (data.totaisPorPessoa && typeof data.totaisPorPessoa === 'object' && '$values' in data.totaisPorPessoa) {
      data.totaisPorPessoa = data.totaisPorPessoa.$values;
    }
  }
  return data;
}

/**
 * Serviço responsável por obter a consulta de totais financeiros.
 * Comunica-se com o endpoint /api/Totais do backend.
 */
export const totaisService = {
  /**
   * Obtém os totais por pessoa e os totais gerais.
   * A resposta é processada para garantir que o array de totais por pessoa esteja acessível.
   * @returns Promise com a estrutura TotaisResponse (totaisPorPessoa e totaisGerais).
   */
  async obter(): Promise<TotaisResponse> {
    const response = await api.get('/Totais');
    return extractArray(response.data);
  },
};