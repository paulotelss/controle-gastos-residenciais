export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
  transacoes?: Transacao[];
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: string;
  pessoaId: number;
  pessoa?: Pessoa;
}

export interface TotalPorPessoa {
  id: number;
  nome: string;
  idade: number;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisGerais {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
}

export interface TotaisResponse {
  totaisPorPessoa: TotalPorPessoa[];
  totaisGerais: TotaisGerais;
}
