/**
 * Componente de cabeçalho (header) da aplicação.
 * 
 * Exibe o título do sistema "Controle de Gastos Residenciais" no topo da tela.
 * Faz parte do layout principal (Layout) e é exibido em todas as telas.
 * 
 * A estilização inclui:
 * - Altura fixa (h-16), fundo branco com borda inferior e sombra suave.
 * - Título centralizado com fonte semibold e cor cinza escura.
 */
export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">
        Controle de Gastos Residenciais
      </h1>
    </header>
  );
}