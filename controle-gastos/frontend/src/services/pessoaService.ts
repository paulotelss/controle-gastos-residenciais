import api from './api';
import type { Pessoa } from '../types';

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
 * Serviço responsável pelas operações relacionadas a pessoas no frontend.
 * Comunica-se com os endpoints /api/Pessoas do backend.
 */
export const pessoaService = {
  /**
   * Lista todas as pessoas cadastradas.
   * A resposta é processada pela função extractArray para garantir que seja um array.
   * @returns Promise com array de pessoas.
   */
  async listar(): Promise<Pessoa[]> {
    const response = await api.get('/Pessoas');
    return extractArray(response.data);
  },

  /**
   * Cria uma nova pessoa.
   * @param pessoa Dados da pessoa (sem o ID, que é gerado automaticamente pelo backend).
   * @returns Promise com a pessoa criada (incluindo o ID gerado).
   */
  async criar(pessoa: Omit<Pessoa, 'id'>): Promise<Pessoa> {
    const response = await api.post('/Pessoas', pessoa);
    return response.data;
  },

  /**
   * Deleta uma pessoa pelo ID.
   * ATENÇÃO: O backend está configurado com ON DELETE CASCADE,
   * portanto todas as transações associadas a esta pessoa também serão deletadas.
   * @param id ID da pessoa a ser deletada.
   */
  async deletar(id: number): Promise<void> {
    await api.delete(`/Pessoas/${id}`);
  },
};