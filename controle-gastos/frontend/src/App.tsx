import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { ListaPessoas } from './components/pessoas/ListaPessoas';
import { ListaTransacoes } from './components/transacoes/ListaTransacoes';
import { ConsultaTotais } from './components/totais/ConsultaTotais';

function App() {
  const [currentPath, setCurrentPath] = useState('/pessoas');

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

  return (
    <Layout currentPath={currentPath} onNavigate={setCurrentPath}>
      {renderContent()}
    </Layout>
  );
}

export default App;
