import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

// Propriedades recebidas pelo componente Layout
interface LayoutProps {
  children: ReactNode;              // Conteúdo da página (tela atual)
  currentPath: string;             // Caminho ativo para destacar no menu
  onNavigate: (path: string) => void; // Função para navegar entre as telas
}

/**
 * Componente de layout principal da aplicação.
 * 
 * Organiza a estrutura visual da página em três partes:
 * 1. Sidebar (menu lateral esquerdo) - Navegação entre as telas.
 * 2. Header (barra superior) - Título do sistema.
 * 3. Conteúdo (children) - Área principal onde as telas são renderizadas.
 * 
 * O layout ocupa toda a altura da tela (h-screen) e é composto por um flex container
 * que distribui o espaço entre o menu lateral e o restante da página.
 */
export function Layout({ children, currentPath, onNavigate }: LayoutProps) {
  return (
    // Container principal com flexbox para dividir a tela
    <div className="flex h-screen">
      {/* Menu lateral (Sidebar) - recebe o caminho atual e a função de navegação */}
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />

      {/* Área direita: Header + Conteúdo */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra superior com o título do sistema */}
        <Header />

        {/* Área de conteúdo principal - scrollável, fundo cinza claro e padding */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}