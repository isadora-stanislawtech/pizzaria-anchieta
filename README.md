# Anchieta Pizzaria  

Aplicação web para gestão de pizzaria, desenvolvida em Next.js, com autenticação de usuários (admin/cliente), pedidos, cardápio, painel administrativo e integração com banco de dados PostgreSQL via Prisma.

**Trabalho P1 — Typescript**  
Professor: **Eduardo Popovici**  
Aluna: **Isadora Estanislau**  
RA: **2526049**

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

## 🛠 Pré-requisitos

- **Node.js 18+**  
- **PostgreSQL 14+** instalado localmente  
  - No Windows pode instalar via [pgAdmin](https://www.pgadmin.org/) ou o [PostgreSQL Installer](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).  
  - É necessário ter também o **cliente `psql`** disponível no terminal para executar comandos SQL.

---

## ⚙️ Configuração do Banco de Dados

1. Clone o repositório e acesse a pasta:
   ```bash
   git clone https://github.com/isadora-stanislawtech/pizzaria-anchieta
   cd anchieta-pizzaria
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um banco local no PostgreSQL:
   ```bash
   createdb pizzaria_anchieta
   ```
   (ou pelo pgAdmin → Create Database → nome `pizzaria_anchieta`).

4. Crie o arquivo `.env` e configure a variável de ambiente:
   ```env
   DATABASE_URL="postgresql://SEU_USUARIO:SUASENHA@localhost:5432/pizzaria_anchieta"
   ```
   > Substitua `SEU_USUARIO` e `SUASENHA` pelo usuário e senha do seu Postgres local.  
   > Em instalações novas, o usuário padrão costuma ser `postgres`.

5. Rode as migrations para criar todas as tabelas:
   ```bash
   npx prisma migrate deploy
   ```
   ou, se for a primeira vez:
   ```bash
   npx prisma db push
   ```

6. Gere o Prisma Client:
   ```bash
   npx prisma generate
   ```

---

## 👤 Criando o usuário administrador

Depois das tabelas criadas, abra o shell do Postgres:
```bash
psql "postgresql://SEU_USUARIO:SUASENHA@localhost:5432/pizzaria_anchieta"
```

E rode o comando abaixo **em uma única linha**:

```sql
INSERT INTO "User" (id, name, email, password, role, createdat, updatedat)
VALUES (gen_random_uuid(), 'Administrador', 'admin@anchieta.br',
'$2b$10$hWrGeccPCSnCZ48PHz5/S.0DK8pF.4MPYKOOVtrpXVKfDN8Qa4YZm',
'admin', NOW(), NOW());
```

> A senha já está salva em hash **bcrypt**. O login é:  
> **Email:** `admin@anchieta.br`  
> **Senha:** `Admin@123`

---

## ▶️ Executando o Projeto

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

- Painel admin: [http://localhost:3000/admin](http://localhost:3000/admin)  
  - Email: `admin@anchieta.br`  
  - Senha: `Admin@123`

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

