import { useState } from 'react';

// Definição dos tipos para os itens do menu
interface MenuItem {
  label: string;    // Rótulo exibido no menu
  path: string;     // Caminho (rota) para navegação
}

// Definição dos grupos do menu (cada grupo tem um título e uma lista de itens)
interface MenuGroup {
  label: string;           // Título do grupo (ex: "Cadastros")
  children: MenuItem[];    // Itens do grupo
}

/**
 * Dados do menu lateral.
 * Estrutura em árvore com dois grupos principais:
 * - Cadastros: Pessoas e Transações
 * - Consultas: Totais Gerais
 * 
 * Esta estrutura é renderizada dinamicamente e permite expansão/colapso.
 */
const menuData: MenuGroup[] = [
  {
    label: 'Cadastros',
    children: [
      { label: 'Pessoas', path: '/pessoas' },
      { label: 'Transações', path: '/transacoes' },
    ],
  },
  {
    label: 'Consultas',
    children: [
      { label: 'Totais Gerais', path: '/totais' },
    ],
  },
];

// Propriedades recebidas pelo componente Sidebar
interface SidebarProps {
  currentPath: string;                // Caminho ativo no momento (para destacar o item)
  onNavigate: (path: string) => void; // Função callback para navegar entre telas
}

/**
 * Componente de menu lateral.
 * 
 * Funcionalidades:
 * - Menu em árvore com grupos expansíveis (abre/fecha ao clicar no título).
 * - Item ativo é destacado visualmente (background azul).
 * - Comunicação com o componente pai via callback onNavigate.
 * - Estilização com cores corporativas (azul escuro, branco).
 */
export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  // Estado que armazena quais grupos estão abertos (expansíveis).
  // Inicialmente, o grupo "Cadastros" vem aberto por padrão.
  const [openMenus, setOpenMenus] = useState<string[]>(['Cadastros']);

  /**
   * Alterna a expansão/colapso de um grupo do menu.
   * Se o grupo já estiver aberto, remove da lista (fecha).
   * Se estiver fechado, adiciona à lista (abre).
   */
  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <aside className="w-64 h-screen bg-[#1e3a5f] text-white flex-shrink-0 overflow-y-auto">
      {/* Título do sistema no topo do menu */}
      <div className="p-4 border-b border-blue-700 font-bold text-lg tracking-wider">
        Gastos Residenciais
      </div>

      {/* Navegação */}
      <nav className="p-2">
        {menuData.map((group) => (
          <div key={group.label}>
            {/* Botão para expandir/recolher o grupo */}
            <button
              onClick={() => toggleMenu(group.label)}
              className="w-full text-left py-2 px-3 hover:bg-blue-600 rounded flex items-center gap-2 text-sm font-medium"
            >
              <span>{openMenus.includes(group.label) ? '▼' : '▶'}</span>
              {group.label}
            </button>

            {/* Itens do grupo (renderizados apenas se o grupo estiver aberto) */}
            {openMenus.includes(group.label) && (
              <div className="ml-4 border-l-2 border-blue-400 pl-2">
                {group.children.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onNavigate(item.path)}
                    className={`block w-full text-left py-1.5 px-3 text-sm rounded transition-colors ${
                      currentPath === item.path
                        ? 'bg-blue-500 text-white' // Item ativo
                        : 'hover:bg-blue-500/50'    // Hover suave
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}