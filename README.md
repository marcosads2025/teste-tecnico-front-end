# 📅 Painel de Gestão de Eventos

Este é um projeto desenvolvido como teste técnico. O sistema consiste em um dashboard para acompanhamento de eventos, visualização de detalhes em tempo real e controle de acesso (check-in) dos participantes, aplicando regras de negócio específicas.

## 🚀 Tecnologias Utilizadas

* **Framework:** React com Next.js (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS
* **Gráficos:** Recharts
* **API Simulada:** JSON Server

## ⚙️ Arquitetura e Decisões Técnicas

* **Next.js & App Router:** Escolhido pela facilidade na criação de rotas dinâmicas, suporte a Server-Side Rendering (SSR) no futuro e melhor organização de layouts globais.
* **TypeScript:** Utilizado para garantir a tipagem estática e a integridade dos dados trafegados entre a API e os componentes, reduzindo erros em tempo de execução.
* **Tailwind CSS:** Adotado para agilizar a criação de uma interface limpa, responsiva e moderna sem a necessidade de manter arquivos CSS extensos, facilitando a manutenção.
* **Separação de Responsabilidades (Arquitetura Limpa):**
    * A lógica de chamadas HTTP foi isolada na pasta `services/api.ts`.
    * Tipagens globais centralizadas na pasta `types/`.
    * Componentes reutilizáveis (como a Tabela de Participantes) separados das páginas (`app/`).
* **Tratamento de Estados:** Implementação cuidadosa de *Early Returns* para gerenciar visualmente os estados de Carregamento (Loading), Erro e Lista Vazia (Empty State) antes de renderizar os dados principais.

## 💼 Regras de Negócio Implementadas

O coração da aplicação reside nas regras de check-in, que validam ações em tempo real:

* **Eventos Encerrados:** Bloqueio de qualquer interação de check-in caso o status do evento seja `closed`.
* **Participante Normal:** Permissão de entrada única. Tentativas subsequentes geram erro com feedback visual informando que o check-in já foi realizado.
* **Participante VIP:** Acesso irrestrito, permitindo realizar o check-in e check-out diversas vezes, atualizando o status dinamicamente para `inside` ou `outside`.
* **Dashboard Dinâmico:** As análises de Check-ins, Erros e Taxa de Entrada são recalculadas em tempo real na interface após cada interação na tabela.

---

## 🛠️ Como Executar o Projeto Localmente

O projeto consome uma API local simulada usando o `json-server`. Para que o sistema funcione corretamente, é **obrigatório** rodar o Front-end e a API simultaneamente em terminais separados.

**Pré-requisitos:** Node.js instalado na máquina.

### 1. Instalação das dependências
Abra um terminal na raiz do projeto e execute o comando abaixo para instalar os pacotes necessários:

npm install


### 2. Rodando os serviços (Dois Terminais)

Para facilitar a visualização no seu ambiente de desenvolvimento, dentro do terminal do IntelliJ IDEA você pode clicar com o botão direito na aba do terminal aberto e selecionar **"Split Right"** (Dividir para a direita) ou abrir uma nova aba de terminal para executar os dois serviços em paralelo.

**Terminal 1: Iniciar a API (Mock Database)**
Neste primeiro terminal, rode o servidor de dados:

npm run api

> **Aviso:** A API ficará rodando em `http://localhost:3001`. Este terminal deve ser mantido **aberto e rodando** durante todo o uso da aplicação.

**Terminal 2: Iniciar o Front-end**
No segundo terminal, com a API já rodando no primeiro, inicie a interface:

npm run dev

> **Pronto!** Agora basta acessar a aplicação no seu navegador através do endereço `http://localhost:3000`.

---

## 🔮 Melhorias Futuras (Com mais tempo)

Se houvesse um prazo maior para o desenvolvimento, as seguintes melhorias seriam implementadas:

* **Gerenciamento de Estado Global:** Substituição do estado local e chamadas de API nativas por bibliotecas como React Query (TanStack Query) ou SWR, para facilitar o cache, revalidação automática de dados em background e otimização de UI otimista.
* **Debounce na Busca:** Implementação de um *debounce* (ex: `use-debounce`) no input de pesquisa da listagem de eventos para evitar renderizações/filtros excessivos enquanto o usuário digita.
* **Acessibilidade (A11y):** Inclusão aprofundada de atributos `aria-labels`, garantia de navegação total via teclado e testes de contraste de cores.
* **Testes Automatizados:** Expansão da cobertura de testes utilizando Jest e React Testing Library para os componentes isolados, e Cypress ou Playwright para fluxos *End-to-End* (E2E), como o fluxo completo de Check-in.
