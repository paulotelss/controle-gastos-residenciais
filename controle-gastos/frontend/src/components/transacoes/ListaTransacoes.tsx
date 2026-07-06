import { useEffect, useState } from 'react';
import { transacaoService } from '../../services/transacaoService';
import { pessoaService } from '../../services/pessoaService';
import type { Transacao, Pessoa } from '../../types';

export function ListaTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('Receita');
  const [pessoaId, setPessoaId] = useState('');
  const [selectedPessoaIdade, setSelectedPessoaIdade] = useState<number | null>(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [transacoesData, pessoasData] = await Promise.all([
        transacaoService.listar(),
        pessoaService.listar(),
      ]);
      // Filtra transações inválidas (sem id ou descrição)
      const transacoesValidas = Array.isArray(transacoesData) 
        ? transacoesData.filter(t => t.id && t.descricao) 
        : [];
      setTransacoes(transacoesValidas);
      setPessoas(Array.isArray(pessoasData) ? pessoasData : []);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados. Verifique se o servidor está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handlePessoaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setPessoaId(id);
    const pessoa = pessoas.find(p => p.id === parseInt(id));
    setSelectedPessoaIdade(pessoa ? pessoa.idade : null);
    if (pessoa && pessoa.idade < 18) {
      setTipo('Despesa');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transacaoService.criar({
        descricao,
        valor: parseFloat(valor),
        tipo,
        pessoaId: parseInt(pessoaId),
      });
      setDescricao('');
      setValor('');
      setTipo('Receita');
      setPessoaId('');
      setSelectedPessoaIdade(null);
      setShowModal(false);
      await carregarDados();
    } catch (err) {
      alert('Erro ao criar transação. Verifique os dados.');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Transações</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Nova Transação
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pessoa</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transacoes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Nenhuma transação cadastrada.
                </td>
              </tr>
            ) : (
              transacoes.map((transacao) => (
                <tr key={transacao.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transacao.id || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transacao.descricao || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {transacao.valor?.toFixed(2) ?? '0,00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      transacao.tipo === 'Receita' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transacao.tipo || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transacao.pessoa?.nome || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - mesmo código anterior */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Nova Transação</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pessoa</label>
                <select
                  value={pessoaId}
                  onChange={handlePessoaChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione</option>
                  {pessoas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.idade} anos)
                    </option>
                  ))}
                </select>
                {selectedPessoaIdade !== null && selectedPessoaIdade < 18 && (
                  <p className="mt-1 text-sm text-orange-600">
                    ⚠️ Menor de idade: apenas despesas são permitidas.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={selectedPessoaIdade !== null && selectedPessoaIdade < 18}
                >
                  <option value="Receita">Receita</option>
                  <option value="Despesa">Despesa</option>
                </select>
                {selectedPessoaIdade !== null && selectedPessoaIdade < 18 && (
                  <p className="mt-1 text-sm text-gray-500">Campo bloqueado para menores de idade.</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}