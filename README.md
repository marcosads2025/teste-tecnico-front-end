# 📅 Painel de Gestão de Eventos

Este é um projeto desenvolvido como teste técnico . O sistema consiste em um dashboard para acompanhamento de eventos, métricas em tempo real e controle de acesso (check-in) de participantes através da aplicação de regras de negócio específicas.

## 🚀 Tecnologias Utilizadas

* **Framework:** React com [Next.js](https://nextjs.org/) (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS
* **Gráficos:** Recharts
* **Mock API:** JSON-Server

## ⚙️ Arquitetura e Decisões Técnicas

* **Next.js & App Router:** Escolhido pela facilidade na criação de rotas dinâmicas, suporte a Server-Side Rendering (SSR) no futuro e melhor organização de layouts globais.
* **TypeScript:** Utilizado para garantir a tipagem estática e a integridade dos dados trafegados entre a API e os componentes, reduzindo erros em tempo de execução.
* **Tailwind CSS:** Adotado para agilizar a criação de uma interface limpa, responsiva e moderna sem a necessidade de manter arquivos CSS extensos, facilitando a manutenção.
* **Separação de Responsabilidades (Clean Architecture):** * A lógica de chamadas HTTP foi isolada na pasta `services/api.ts`.
  * Tipagens globais centralizadas na pasta `types/`.
  * Componentes reutilizáveis (como a Tabela de Participantes) separados das páginas (`app/`).
* **Tratamento de Estados:** Implementação cuidadosa de "Early Returns" para gerenciar visualmente os estados de *Loading*, *Erro* e *Vazia* (Empty State) antes de renderizar os dados principais.

## 💼 Regras de Negócio Implementadas

O coração da aplicação reside nas regras de check-in, que validam ações em tempo real:
1. **Eventos Encerrados:** Bloqueio de qualquer interação de check-in caso o status do evento seja `closed`.
2. **Participante Normal:** Permissão de entrada única. Tentativas subsequentes geram erro com feedback visual informando que o check-in já foi realizado.
3. **Participante VIP:** Acesso irrestrito, permitindo realizar o check-in e check-out múltiplas vezes, atualizando os status para `inside` ou `outside`.
4. **Dashboard Dinâmico:** As métricas de *Check-ins*, *Erros* e a *Taxa de Entrada* são recalculadas em tempo real na interface após cada interação na tabela.

## 🛠️ Como Executar o Projeto Localmente

O projeto consome uma API local simulada usando o `json-server`. Para que o sistema funcione corretamente, é necessário rodar o Front-end e a API simultaneamente.

**Pré-requisitos:** Node.js instalado na máquina.

**1. Instale as dependências:**
Na raiz do projeto, execute:
\`\`\`bash
npm install
\`\`\`

**2. Inicie a API (Mock Database):**
Abra um terminal na raiz do projeto e execute:
\`\`\`bash
npm run api
\`\`\`
*(A API ficará rodando em http://localhost:3001 e o terminal deve ser mantido aberto)*

**3. Inicie o Front-end:**
Abra um **segundo terminal** (mantenha o da API rodando) e execute:
\`\`\`bash
npm run dev
\`\`\`
*(Acesse a aplicação em http://localhost:3000)*

## 🔮 Melhorias Futuras (Com mais tempo)

Se houvesse mais tempo de desenvolvimento, as seguintes melhorias seriam implementadas:
* **Gerenciador de Estado Global:** Substituição do estado local e chamadas de API nativas por bibliotecas como **React Query** (TanStack Query) ou **SWR**, para facilitar o cache, revalidação automática de dados em background e otimização do optimistic UI.
* **Debounce na Busca:** Implementação de um *debounce* (ex: `use-debounce`) no input de pesquisa da listagem de eventos para evitar renderizações/filtros excessivos enquanto o usuário digita.
* **Acessibilidade (A11y):** Inclusão aprofundada de atributos `aria-labels`, garantia de navegação total via teclado e testes de contraste de cores.
* **Testes Automatizados (E2E e Unitários):** Expansão da cobertura de testes utilizando Jest/React Testing Library para os componentes isolados e Cypress/Playwright para o fluxo End-to-End de Check-in.



