import api from './api';
import type { Transacao } from '../types';

/**
 * Função auxiliar para extrair o array de uma resposta do backend.
 * O backend utiliza ReferenceHandler.Preserve, que retorna objetos com a estrutura:
 * { "$id": "...", "$values": [ ... ] } em vez de um array puro.
 * Esta função extrai o array interno quando necessário.
 */
function extractArray(data: any): any[] {
  if (data && typeof data === 'object' && '$values' in data) {
    return data.$values;
  }
  return data;
}

/**
 * Serviço responsável pelas operações relacionadas a transações no frontend.
 * Comunica-se com os endpoints /api/Transacoes do backend.
 */
export const transacaoService = {
  /**
   * Lista todas as transações cadastradas.
   * A resposta é processada pela função extractArray para garantir que seja um array.
   * @returns Promise com array de transações.
   */
  async listar(): Promise<Transacao[]> {
    const response = await api.get('/Transacoes');
    return extractArray(response.data);
  },

  /**
   * Cria uma nova transação.
   * O backend aplica a regra de negócio: menores de 18 anos só podem cadastrar despesas.
   * @param transacao Dados da transação (sem o ID, que é gerado automaticamente).
   * @returns Promise com a transação criada (incluindo o ID gerado).
   */
  async criar(transacao: Omit<Transacao, 'id'>): Promise<Transacao> {
    const response = await api.post('/Transacoes', transacao);
    return response.data;
  },
};