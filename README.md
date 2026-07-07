# controle-gastos-residenciais
[![CI/CD](https://github.com/paulotelss/controle-gastos-residenciais/actions/workflows/ci.yml/badge.svg)](https://github.com/paulotelss/controle-gastos-residenciais/actions/workflows/ci.yml)



## Modelagem do Banco de Dados

```mermaid
erDiagram
    Pessoas {
        int Id PK
        string Nome
        int Idade
    }
    Transacoes {
        int Id PK
        string Descricao
        decimal Valor
        string Tipo
        int PessoaId FK
    }
    Pessoas ||--o{ Transacoes : "1:N (ON DELETE CASCADE)"
```

## Arquitetura do Sistema

```mermaid
graph TD
    A[Frontend React] -->|HTTP /api| B[Backend NET 8]
    B --> C[SQLite Database]
    B --> D[Regras de Negocio]
    D --> E[Menor de 18 so Despesa]
    D --> F[Delete em cascata]
    B --> G[Endpoints]
    G --> H[GET /api/Pessoas]
    G --> I[POST /api/Pessoas]
    G --> J[DELETE /api/Pessoas]
    G --> K[GET /api/Transacoes]
    G --> L[POST /api/Transacoes]
    G --> M[GET /api/Totais]
```

## Fluxo de Detalhamento (Modal)

```mermaid
sequenceDiagram
    participant Usuario
    participant Frontend
    participant Backend
    participant Banco
    Usuario->>Frontend: Clica em "Detalhar"
    Frontend->>Backend: GET /api/Transacoes
    Backend->>Banco: SELECT * FROM Transacoes WHERE PessoaId = X
    Banco-->>Backend: Lista de transações
    Backend-->>Frontend: JSON com transações
    Frontend-->>Usuario: Exibe modal com histórico
```


## Como testar a aplicação

### Testando a API (Swagger)

Com o back-end rodando, acesse:
Ex: http://localhost:[numero_porta_exibido_terminal]/swagger


Lá você pode testar todos os endpoints da API:

| Endpoint | Método | Descrição |
| :--- | :--- | :--- |
| `/api/Pessoas` | GET | Lista todas as pessoas |
| `/api/Pessoas` | POST | Cria uma nova pessoa |
| `/api/Pessoas/{id}` | DELETE | Deleta uma pessoa (e todas as suas transações) |
| `/api/Transacoes` | GET | Lista todas as transações |
| `/api/Transacoes` | POST | Cria uma nova transação (com validação de idade) |
| `/api/Totais` | GET | Consulta totais por pessoa e totais gerais |

### Testando a interface web

Com o front-end rodando, acesse:
Ex: http://localhost:[numero_porta_exibido_terminal]



## Como executar o projeto

### Pré-requisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)

### Back-end
```bash
cd controle-gastos/backend/ControleGastosAPI
dotnet restore
dotnet run
```

### Front-end
```bash
cd controle-gastos/frontend
npm install
npm run dev
```

---


## 📹 Vídeo de demonstração

[![Assista ao vídeo de demonstração](https://img.youtube.com/vi/mkS9nGcczgE/0.jpg)](https://youtu.be/mkS9nGcczgE)
