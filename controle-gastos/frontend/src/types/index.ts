/**
 * Tipos e interfaces TypeScript usados em todo o frontend.
 * Definem a estrutura dos dados trocados entre frontend e backend.
 */

/**
 * Representa uma pessoa cadastrada no sistema.
 */
export interface Pessoa {
  id: number;                   // Identificador único
  nome: string;                 // Nome completo
  idade: number;                // Idade em anos (usada na validação de menor de 18)
  transacoes?: Transacao[];     // Lista de transações associadas (opcional, usada em detalhamentos)
}

/**
 * Representa uma transação financeira (receita ou despesa).
 */
export interface Transacao {
  id: number;                   // Identificador único
  descricao: string;            // Descrição da transação (ex: "Salário", "Obra")
  valor: number;                // Valor monetário
  tipo: string;                 // "Receita" ou "Despesa"
  pessoaId: number;             // Chave estrangeira para a pessoa associada
  pessoa?: Pessoa;              // Dados da pessoa (opcional, usado em listagens com join)
}

/**
 * Resumo financeiro de uma pessoa para a consulta de totais.
 */
export interface TotalPorPessoa {
  id: number;                   // ID da pessoa
  nome: string;                 // Nome da pessoa
  idade: number;                // Idade da pessoa
  totalReceitas: number;        // Soma de todas as receitas da pessoa
  totalDespesas: number;        // Soma de todas as despesas da pessoa
  saldo: number;                // Receitas - Despesas
}

/**
 * Totais gerais de todas as pessoas.
 */
export interface TotaisGerais {
  totalReceitas: number;        // Soma de todas as receitas de todas as pessoas
  totalDespesas: number;        // Soma de todas as despesas de todas as pessoas
  saldoLiquido: number;         // TotalReceitas - TotalDespesas
}

/**
 * Estrutura completa da resposta do endpoint /api/Totais.
 */
export interface TotaisResponse {
  totaisPorPessoa: TotalPorPessoa[];  // Lista com o resumo de cada pessoa
  totaisGerais: TotaisGerais;         // Totais consolidados de todas as pessoas
}