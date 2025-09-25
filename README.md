# Anchieta Pizzaria  

Aplicação web para gestão de pizzaria, desenvolvida em Next.js, com autenticação de usuários (admin/cliente), pedidos, cardápio, painel administrativo e integração com banco de dados PostgreSQL via Prisma.

---

## Manual de Utilização

- **Clientes** podem:
  - Visualizar o cardápio, adicionar itens ao carrinho e realizar pedidos (delivery ou retirada).
  - Cadastrar-se, fazer login e acompanhar seus pedidos.
- **Administradores** podem:
  - Acessar o painel `/admin` para visualizar estatísticas, gerenciar pedidos, produtos e clientes.
  - Receber notificações em tempo real de novos pedidos.

A navegação é feita pelo menu superior. O botão "FAÇA SEU PEDIDO" leva ao cardápio. O login/admin é acessado pelo menu.

---

## Estrutura do Projeto

```
anchieta-pizzaria/
│
├── prisma/                # Migrations e schema do banco (PostgreSQL)
│   └── schema.prisma
│
├── public/                # Imagens, fontes e uploads
│
├── src/
│   ├── app/               # Páginas e rotas (Next.js App Router)
│   │   ├── components/    # Componentes compartilhados (Header, Footer, Contexts)
│   │   ├── admin/         # Dashboard do admin
│   │   ├── cadastro/      # Cadastro de usuários/produtos
│   │   ├── cardapio/      # Página do cardápio
│   │   ├── carrinho/      # Carrinho de compras
│   │   ├── cliente/       # Área do cliente
│   │   ├── pedidos/       # Listagem e status de pedidos
│   │   └── api/           # Rotas de API (Next.js Route Handlers)
│   └── lib/prisma.ts      # Instância do Prisma Client
│
├── .env                   # Variáveis de ambiente (ex: DATABASE_URL)
├── package.json           # Scripts e dependências
├── tailwind.config.js     # Configuração do Tailwind CSS
├── tsconfig.json          # Configuração do TypeScript
└── README.md
```

### Principais Dependências

- **next**: Framework React para SSR/SSG.  
- **react, react-dom**: Biblioteca base.  
- **@prisma/client, prisma**: ORM para PostgreSQL.  
- **pg**: Driver PostgreSQL.  
- **tailwindcss**: Utilitário CSS.  
- **eslint**: Linter.  
- **bcryptjs**: Hash de senhas.  
- **lucide-react, lottie-react**: Ícones e animações.  

---

## Instruções de Instalação e Execução

### Pré-requisitos
- Node.js 18+  
- PostgreSQL rodando localmente (ajuste a variável `DATABASE_URL` em `.env` se necessário)  

### Passos
1. Clone o repositório e acesse a pasta:
    ```bash
    git clone https://github.com/isadora-stanislawtech/pizzaria-anchieta
    cd anchieta-pizzaria
    ```

2. Instale as dependências:
    ```bash
    npm install
    # ou
    yarn install
    ```

3. Configure o banco de dados:
    - Edite o arquivo `.env` se necessário:
        ```
        DATABASE_URL="postgresql://usuario:senha@localhost:4444/anchieta"
        ```
    - Rode as migrations:
        ```bash
        npx prisma migrate deploy
        # ou
        npx prisma db push
        ```

4. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

5. Acesse em: [http://localhost:3000](http://localhost:3000)  

---

## Scripts Úteis

- `npm run dev` — Inicia o servidor Next.js em modo desenvolvimento.  
- `npm run build` — Gera build de produção.  
- `npm start` — Inicia o servidor em produção.  
- `npm run lint` — Executa o linter.  

---

## Diagramas do Sistema (P1)

### Diagrama Simplificado
```mermaid
mindmap
  root((Sistema de Pizzaria))
    Entrada
      Cliente (cadastro/login)
      Pedido (itens, tamanhos, observações)
      Endereço ou Retirada
      Pagamento
      Admin (produtos e preços)
    Armazenamento
      PostgreSQL
        users
        produtos
        produto_precos
        pedidos
        pedido_itens
        enderecos
        payments
        notifications
    Processamento
      Calcular total do pedido
      Validar estoque/preços
      Criar/atualizar Pedido
      Atualizar status
      Notificações
    Saída
      Status do Pedido
        Criado
        Em Preparo
        Pronto
        Entregue
      Comprovante
      Nota Fiscal
    Consulta
      Por cliente
      Por pedido
      Relatórios de vendas
```

### Diagrama de Arquitetura
```mermaid
flowchart TD
  subgraph User["Usuário/Administrador"]
    BROWSER["Navegador (Cliente Web)"]
  end

  subgraph Front["Frontend - Next.js (App Router)"]
    PAGES["Páginas e Componentes"]
  end

  subgraph API["APIs - Next.js Route Handlers"]
    API_PED["/api/pedidos"]
    API_PROD["/api/produtos"]
    API_CLIENTE["/api/clientes"]
    API_AUTH["/api/auth/login"]
    API_NOTIF["/api/notifications"]
  end

  subgraph DB["Banco de Dados"]
    PG[(PostgreSQL via Prisma)]
  end

  BROWSER -->|HTTP| PAGES
  PAGES -->|fetch| API
  API --> PG
```

---

## Observações

- O painel admin requer login com usuário de role `admin`.  
- Para customizar estilos, edite `tailwind.config.js` e variáveis CSS.  
- O Prisma Client é gerado automaticamente após as migrations.  

---

## Identificação da Entrega

**Trabalho P1 — Typescript**  
Professor: **Eduardo Popovici**  
Aluna: **Isadora Estanislau**  
RA: **2526049**
