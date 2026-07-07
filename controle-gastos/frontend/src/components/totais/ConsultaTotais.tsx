import { useEffect, useState } from 'react';
import { totaisService } from '../../services/totaisService';
import type { TotaisResponse, Transacao, TotalPorPessoa } from '../../types';

/**
 * Componente principal para consulta de totais financeiros.
 * - Exibe o resumo (receitas, despesas, saldo) de cada pessoa.
 * - Exibe totais gerais (soma de todas as pessoas).
 * - Permite detalhar as transações de uma pessoa específica via modal.
 * 
 * Esta tela atende ao requisito de "Consulta de totais" do desafio,
 * com um extra: o detalhamento individual por pessoa.
 */
export function ConsultaTotais() {
  // Estado: dados completos da consulta (totais por pessoa + totais gerais)
  const [dados, setDados] = useState<TotaisResponse | null>(null);
  // Estado: indicador de carregamento da consulta principal
  const [loading, setLoading] = useState(true);
  // Estado: mensagem de erro (se houver) da consulta principal
  const [error, setError] = useState<string | null>(null);

  // Estados para controlar o modal de detalhamento de transações por pessoa
  const [showModal, setShowModal] = useState(false);
  const [pessoaSelecionada, setPessoaSelecionada] = useState<TotalPorPessoa | null>(null);
  const [transacoesPessoa, setTransacoesPessoa] = useState<Transacao[]>([]);
  const [loadingTransacoes, setLoadingTransacoes] = useState(false);

  /**
   * Carrega os totais do backend usando o totaisService.
   * Atualiza os estados de loading, dados e erro.
   */
  const carregarTotais = async () => {
    try {
      setLoading(true);
      const data = await totaisService.obter();
      setDados(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar totais. Verifique se o servidor está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Executa o carregamento assim que o componente é montado
  useEffect(() => {
    carregarTotais();
  }, []);

  /**
   * Função recursiva para extrair todas as transações de um objeto JSON,
   * garantindo unicidade por ID usando um Map.
   * 
   * Isso é necessário porque o backend utiliza ReferenceHandler.Preserve,
   * que retorna estruturas com $id, $values e $ref (referências circulares).
   * A função percorre todo o objeto, extrai cada transação válida e
   * evita duplicatas usando o ID como chave do Map.
   */
  const extrairTodasTransacoes = (data: any): Transacao[] => {
    const map = new Map<number, Transacao>();

    function percorrer(obj: any) {
      if (!obj) return;
      if (Array.isArray(obj)) {
        for (const item of obj) {
          percorrer(item);
        }
        return;
      }
      if (typeof obj !== 'object') return;

      // Se for uma referência, pula (pois será resolvida em outro lugar)
      if (obj.$ref) return;

      // Se for uma transação válida (tem id e descrição), adiciona ao Map
      if (obj.id !== undefined && obj.descricao) {
        map.set(obj.id, obj as Transacao);
      }

      // Percorre propriedades que podem conter transações aninhadas
      if (obj.$values) percorrer(obj.$values);
      if (obj.pessoa?.transacoes?.$values) percorrer(obj.pessoa.transacoes.$values);
      if (obj.transacoes?.$values) percorrer(obj.transacoes.$values);
      // Percorre qualquer outra propriedade que seja objeto/array
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object') {
          percorrer(obj[key]);
        }
      }
    }

    percorrer(data);
    return Array.from(map.values());
  };

  /**
   * Abre o modal de detalhamento para uma pessoa específica.
   * - Faz uma requisição direta ao backend (fetch) para obter todas as transações.
   * - Extrai todas as transações usando a função recursiva.
   * - Filtra apenas as transações da pessoa selecionada.
   * - Atualiza o estado transacoesPessoa e exibe o modal.
   */
  const abrirDetalhes = async (pessoa: TotalPorPessoa) => {
    setPessoaSelecionada(pessoa);
    setShowModal(true);
    setLoadingTransacoes(true);

    try {
      // Faz a requisição direta para evitar qualquer interferência do serviço
      const response = await fetch('/api/Transacoes');
      const data = await response.json();

      const todas = extrairTodasTransacoes(data);
      const filtradas = todas.filter(t => Number(t.pessoaId) === Number(pessoa.id));

      console.log('Transações filtradas para', pessoa.nome, ':', filtradas);
      setTransacoesPessoa(filtradas);
    } catch (err) {
      alert('Erro ao carregar transações da pessoa.');
      console.error(err);
    } finally {
      setLoadingTransacoes(false);
    }
  };

  // Enquanto carrega, exibe um indicador visual
  if (loading) return <div className="text-center py-8">Carregando...</div>;

  // Em caso de erro, exibe a mensagem de erro
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  // Se não houver dados ou lista vazia, exibe mensagem informativa
  if (!dados || dados.totaisPorPessoa.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nenhuma pessoa cadastrada para exibir totais.</div>;
  }

  return (
    <div>
      {/* Título da página */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Consulta de Totais</h2>

      {/* Tabela com totais por pessoa */}
      <div className="bg-white rounded shadow overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pessoa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Receitas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Despesas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dados.totaisPorPessoa.map((pessoa) => (
              <tr key={pessoa.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pessoa.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pessoa.idade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  R$ {pessoa.totalReceitas.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  R$ {pessoa.totalDespesas.toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                  pessoa.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  R$ {pessoa.saldo.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {/* Botão para abrir o modal de detalhamento */}
                  <button
                    onClick={() => abrirDetalhes(pessoa)}
                    className="text-blue-600 hover:text-blue-900 transition"
                  >
                    Detalhar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totais gerais (consolidado de todas as pessoas) */}
      <div className="bg-blue-50 border border-blue-200 rounded p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Totais Gerais</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Receitas</p>
            <p className="text-xl font-bold text-green-600">
              R$ {dados.totaisGerais.totalReceitas.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Despesas</p>
            <p className="text-xl font-bold text-red-600">
              R$ {dados.totaisGerais.totalDespesas.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Saldo Líquido</p>
            <p className={`text-xl font-bold ${
              dados.totaisGerais.saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              R$ {dados.totaisGerais.saldoLiquido.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Modal de detalhamento das transações da pessoa selecionada */}
      {showModal && pessoaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* Cabeçalho do modal */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Transações de {pessoaSelecionada.nome}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Conteúdo do modal: lista de transações da pessoa */}
            {loadingTransacoes ? (
              <div className="text-center py-4">Carregando transações...</div>
            ) : transacoesPessoa.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Nenhuma transação cadastrada para esta pessoa.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transacoesPessoa.map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{t.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{t.descricao}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        R$ {t.valor?.toFixed(2) ?? '0,00'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          t.tipo === 'Receita' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {t.tipo}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}