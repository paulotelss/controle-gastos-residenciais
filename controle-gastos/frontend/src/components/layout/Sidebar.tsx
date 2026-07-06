import { useState } from 'react';

interface MenuItem {
  label: string;
  path: string;
}

interface MenuGroup {
  label: string;
  children: MenuItem[];
}

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

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>(['Cadastros']);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <aside className="w-64 h-screen bg-[#1e3a5f] text-white flex-shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-blue-700 font-bold text-lg tracking-wider">
        Gastos Residenciais
      </div>

      <nav className="p-2">
        {menuData.map((group) => (
          <div key={group.label}>
            <button
              onClick={() => toggleMenu(group.label)}
              className="w-full text-left py-2 px-3 hover:bg-blue-600 rounded flex items-center gap-2 text-sm font-medium"
            >
              <span>{openMenus.includes(group.label) ? '▼' : '▶'}</span>
              {group.label}
            </button>

            {openMenus.includes(group.label) && (
              <div className="ml-4 border-l-2 border-blue-400 pl-2">
                {group.children.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onNavigate(item.path)}
                    className={`block w-full text-left py-1.5 px-3 text-sm rounded transition-colors ${
                      currentPath === item.path
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-blue-500/50'
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
