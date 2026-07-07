import { useState, useEffect } from 'react';
import { pessoaService } from '../../services/pessoaService';
import type { Pessoa } from '../../types';

/**
 * Componente principal para gerenciamento de pessoas.
 * - Lista todas as pessoas cadastradas
 * - Permite criar novas pessoas (via modal)
 * - Permite deletar pessoas (com confirmação e aviso sobre cascade delete)
 */
export function ListaPessoas() {
  // Estado: lista de pessoas carregadas do backend
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  // Estado: indicador de carregamento
  const [loading, setLoading] = useState(true);
  // Estado: mensagem de erro (se houver)
  const [error, setError] = useState<string | null>(null);
  // Estado: controla a visibilidade do modal de criação
  const [showModal, setShowModal] = useState(false);
  // Estado: nome digitado no formulário
  const [nome, setNome] = useState('');
  // Estado: idade digitada no formulário
  const [idade, setIdade] = useState('');

  /**
   * Função que carrega a lista de pessoas do backend.
   * Usa o pessoaService.listar() e trata possíveis erros.
   * Atualiza os estados de loading, dados e erro.
   */
  const carregarPessoas = async () => {
    try {
      setLoading(true);
      const data = await pessoaService.listar();
      setPessoas(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar pessoas. Verifique se o servidor está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Executa o carregamento assim que o componente é montado
  useEffect(() => {
    carregarPessoas();
  }, []);

  /**
   * Envia o formulário de criação de uma nova pessoa.
   * Valida os dados, chama o serviço de criação e, em caso de sucesso,
   * recarrega a lista e fecha o modal.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pessoaService.criar({
        nome,
        idade: parseInt(idade),
      });
      // Limpa os campos do formulário
      setNome('');
      setIdade('');
      // Fecha o modal
      setShowModal(false);
      // Recarrega a lista para mostrar a nova pessoa
      await carregarPessoas();
    } catch (err) {
      alert('Erro ao criar pessoa. Verifique os dados.');
      console.error(err);
    }
  };

  /**
   * Deleta uma pessoa pelo ID.
   * Exibe uma confirmação antes de prosseguir, lembrando que o delete em cascata
   * removerá todas as transações associadas à pessoa.
   */
  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta pessoa? Todas as transações associadas também serão removidas.')) {
      return;
    }
    try {
      await pessoaService.deletar(id);
      // Recarrega a lista após a exclusão
      await carregarPessoas();
    } catch (err) {
      alert('Erro ao deletar pessoa.');
      console.error(err);
    }
  };

  // Enquanto carrega, exibe um indicador visual
  if (loading) return <div className="text-center py-8">Carregando...</div>;

  // Em caso de erro, exibe a mensagem de erro
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div>
      {/* Cabeçalho com título e botão para abrir o modal de criação */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pessoas</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Nova Pessoa
        </button>
      </div>

      {/* Tabela com a listagem de pessoas */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pessoas.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Nenhuma pessoa cadastrada.
                </td>
              </tr>
            ) : (
              pessoas.map((pessoa) => (
                <tr key={pessoa.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pessoa.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pessoa.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pessoa.idade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(pessoa.id)}
                      className="text-red-600 hover:text-red-900 transition"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para criar nova pessoa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Nova Pessoa</h3>
            <form onSubmit={handleSubmit}>
              {/* Campo Nome */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Campo Idade */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                <input
                  type="number"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Botões de ação */}
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