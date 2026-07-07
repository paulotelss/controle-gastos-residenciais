import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { ListaPessoas } from './components/pessoas/ListaPessoas';
import { ListaTransacoes } from './components/transacoes/ListaTransacoes';
import { ConsultaTotais } from './components/totais/ConsultaTotais';

/**
 * Componente raiz da aplicação.
 * 
 * Responsável por:
 * - Gerenciar o estado da rota atual (currentPath).
 * - Renderizar o componente correto com base na rota.
 * - Envolver o conteúdo no layout principal (Layout).
 * 
 * A navegação é controlada pelo estado local e pelo componente Layout,
 * que recebe a rota atual e uma função para atualizá-la (onNavigate).
 * Isso permite que o menu lateral (Sidebar) altere a rota sem usar
 * um roteador externo (ex: React Router), mantendo a aplicação simples.
 */
function App() {
  // Estado que armazena o caminho atual da tela (inicia em "/pessoas")
  const [currentPath, setCurrentPath] = useState('/pessoas');

  /**
   * Função que retorna o componente correspondente à rota atual.
   * Usa um switch para mapear cada caminho ao seu respectivo componente.
   * Caso a rota não seja reconhecida, redireciona para a lista de pessoas (fallback).
   */
  const renderContent = () => {
    switch (currentPath) {
      case '/pessoas':
        return <ListaPessoas />;
      case '/transacoes':
        return <ListaTransacoes />;
      case '/totais':
        return <ConsultaTotais />;
      default:
        return <ListaPessoas />;
    }
  };

  // Layout recebe a rota atual e a função para alterá-la,
  // renderizando o conteúdo dentro da área principal.
  return (
    <Layout currentPath={currentPath} onNavigate={setCurrentPath}>
      {renderContent()}
    </Layout>
  );
}

export default App;