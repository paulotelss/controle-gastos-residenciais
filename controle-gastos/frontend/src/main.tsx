import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * Ponto de entrada da aplicação React.
 * 
 * - `StrictMode`: componente que ativa verificações adicionais em modo de desenvolvimento
 *   (ex: detecção de efeitos colaterais, componentes obsoletos, etc.).
 * - `createRoot`: API do React 18+ para renderização no modo concorrente.
 * - `document.getElementById('root')`: elemento HTML onde a aplicação será montada.
 * 
 * O arquivo `index.css` contém as diretivas do Tailwind CSS.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)