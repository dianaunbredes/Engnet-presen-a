# EngNet Presença Acadêmica

Sistema web para gerenciamento de presença acadêmica, desenvolvido para facilitar o controle de alunos, turmas, aulas e registros de frequência.

O projeto possui uma aplicação frontend responsável pela interface do usuário e uma API backend responsável pelas regras de negócio, autenticação e comunicação com o banco de dados.

## Tecnologias utilizadas

### Frontend
- [Next.js](https://nextjs.org/)
- React
- TypeScript
- Tailwind CSS

### Backend
- [NestJS](https://nestjs.com/)
- TypeScript
- TypeORM
- JWT para autenticação
- Class Validator e Class Transformer

### Banco de dados
- PostgreSQL

## Funcionalidades

- Cadastro e gerenciamento de alunos.
- Cadastro e gerenciamento de turmas.
- Controle de matrículas.
- Cadastro e gerenciamento de aulas.
- Registro de presença dos alunos.
- Identificação de presenças, faltas e faltas justificadas.
- Autenticação de usuários.
- Relatórios de frequência por turma e por aluno.
- Dashboard com indicadores gerais de frequência.

## Estrutura do projeto

O repositório está organizado da seguinte maneira:

```text
Engnet-presenca/
│
├── engnet-presenca/          # Aplicação frontend (Next.js)
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── src/                      # Aplicação backend (NestJS)
│   ├── alunos/
│   ├── aulas/
│   ├── auth/
│   ├── matriculas/
│   ├── presencas/
│   ├── turmas/
│   ├── usuarios/
│   ├── app.module.ts
│   └── main.ts
│
├── engnet_banco_de_dados.sql # Script de criação do banco de dados
├── package.json              # Dependências do backend
└── README.md
```

## Requisitos para execução

Antes de iniciar o projeto, é necessário ter instalado:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)
- [Vs Code].

## Instalação e configuração

### 1. Clonar o repositório

Abra o terminal e execute:

```bash
git clone https://github.com/dianaunbredes/Engnet-presen-a.git
```

Entre na pasta do projeto:

```bash
cd Engnet-presen-a
```

### 2. Configurar o banco de dados

O projeto disponibiliza o arquivo `engnet_banco_de_dados.sql`, localizado na raiz do repositório.

Esse arquivo contém o script SQL responsável pela criação da estrutura do banco de dados, incluindo tabelas, relacionamentos, índices, funções, gatilhos, visualizações e dados de demonstração.

Para configurar:

1. Abra o PostgreSQL pelo pgAdmin.
2. Crie um novo banco de dados.
3. Abra o arquivo `engnet_banco_de_dados.sql` no Query Tool do pgAdmin, conectado ao banco recém-criado.
4. Execute todo o script SQL.
5. Verifique se as tabelas e demais estruturas foram criadas corretamente.

**Atenção:** o script contém comandos `DROP TABLE` e `DROP VIEW`, que removem estruturas existentes com os mesmos nomes. Execute-o em um banco vazio ou em um banco cujos dados possam ser apagados.

disponibilizaremos uma senha e login para teste, como um professor o email dele é "professor@engnet.com2", e a senha é "123456".

### 3. Configurar as variáveis de ambiente do backend

Na raiz do projeto, crie um arquivo chamado `.env`.

Configure as variáveis de acordo com os dados do PostgreSQL instalado em sua máquina:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco

JWT_SECRET=sua_chave_secreta
```
O sistema de tokens, foi uma parte bem interessante, onde o usuário não precisa colocar varias vezes suas credenciais 

Substitua os valores de exemplo pelas informações correspondentes ao seu ambiente.

### 4. Instalar as dependências do backend

Na raiz do projeto, execute:

```bash
npm install
```

### 5. Executar o backend

Ainda na raiz do projeto, execute:

```bash
npm run start:dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

### 6. Instalar as dependências do frontend

Abra um novo terminal e entre na pasta do frontend:

```bash
cd engnet-presenca
```

Instale as dependências:

```bash
npm install
```

### 7. Executar o frontend

Na pasta `engnet-presenca`, execute:

```bash
npm run dev -- -p 3001
```

A aplicação ficará disponível em:

```text
http://localhost:3001
```
Para login, use o exemplo dito la em cima,"professor@engnet.com2", e a senha é "123456".

## Execução do projeto

Para utilizar o sistema, é necessário manter os dois serviços em execução:

| Serviço | Endereço |
|---|---|
| Frontend | http://localhost:3001 |
| Backend (API) | http://localhost:3000 |

O frontend realiza as requisições à API backend, que processa as operações e acessa o banco de dados PostgreSQL.

## Banco de dados

O banco de dados é composto pelas seguintes entidades principais:

- **usuarios:** armazena os usuários responsáveis pelo acesso ao sistema.
- **alunos:** armazena os dados dos alunos.
- **turmas:** armazena as informações das turmas.
- **matriculas:** relaciona alunos às respectivas turmas.
- **aulas:** armazena as aulas cadastradas.
- **presencas:** registra a situação de frequência dos alunos em cada aula.

O script também disponibiliza visualizações para consultas de frequência, alunos com baixa frequência, histórico de turmas e indicadores do dashboard.

## Observações

- O backend utiliza o PostgreSQL para persistência dos dados.
- O TypeORM está configurado com `synchronize: false`, portanto, a estrutura do banco deve ser criada por meio do script SQL disponibilizado.
- O backend utiliza CORS para permitir a comunicação com o frontend em `http://localhost:3001`.
- As configurações de conexão e autenticação são carregadas por meio das variáveis de ambiente.

## Autores

Projeto desenvolvido pela equipe Copas

## Observações
O integrante Rafael Aurélio, contou com ajuda da IA, no desenvolvimento do backend.
