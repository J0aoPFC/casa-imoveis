# Casa Imóveis — Projeto Final (Desenvolvimento de Interfaces 2/2026)

- **Instituição:** Centro Universitário de Brasília (CEUB)

- **Disciplina:** Desenvolvimento de Interfaces — 2/2026

- **Professor:** Prof. Dr. Felipe Batista da Silva

- **Aluno:** João Pedro Fialho Campos

- **RA:** 22605006


---

## 1. Visão Geral do Projeto
O **Casa Imóveis** (`casa-imoveis`) é uma plataforma web responsiva desenvolvida para uma imobiliária digital moderna. O projeto adota uma identidade visual com **cores vibrantes e chamativas**, equilibradas por meio de princípios de **Psicologia das Cores**, **UI/UX** e critérios de acessibilidade **WCAG 2.1 (níveis AA e AAA)**.

---

## 2. Por que cada etapa foi construída desta forma (Versionamento)

### Etapa 1 — Fundação, Identidade Visual e Acessibilidade Base (Concluída)
- **Por que esta etapa existe:** Antes de construir componentes visuais complexos, é necessário definir os tokens de design (cores e tipografia), a estrutura semântica HTML5 e os recursos globais de acessibilidade para garantir que toda a interface nasça acessível.

- **O que foi implementado nesta versão:**

  1. **Paleta Vibrante com Contraste Validado (`css/variables.css`):** Uso de Roxo Elétrico (`#5B21B6`, inovação/modernidade, contraste 8,97:1 AAA), Laranja Fogo (`#FF5500`, ação/energia nos botões CTA, contraste 5,97:1 AA) e Amarelo Solar (`#FACC15`, destaque/otimismo nos selos, contraste 12,50:1 AAA), combinados com superfícies neutras (`#F8FAFC` e `#0B0F19`, contraste 18,30:1 AAA).
  2. **Estrutura Semântica e Abas de Pesquisa (`index.html`):** Cabeçalho acessível, link de salto para teclado (*Skip Link*), barra global de acessibilidade e widget de pesquisa com abas WAI-ARIA (*Comprar*, *Alugar* e *Lançamentos*).
  3. **Estilização Responsiva e Indicadores de Foco (`css/style.css`):** Layout fluido adaptado a diferentes telas e contorno de foco de alto contraste (`:focus-visible`) para navegação por teclado.
  4. **Interatividade Base (`js/main.js`):** Alternância entre Modo Claro e Modo Escuro com persistência em `localStorage`, redimensionamento dinâmico de fonte (`A-`, `A`, `A+`) e atualização contextual dos filtros de pesquisa.

### Etapa 2 — Componentes Ricos, Páginas Complementares e Relatório Final (Próxima Fase)
- Carrossel interativo de imóveis em destaque.

- Grade de cartões de imóveis filtráveis e cartões explicativos de serviços.

- Seção de contato com formulário validado e rodapé completo.

- Página dedicada de Login com controles de acessibilidade.

- Relatório acadêmico final (Heurísticas de Nielsen, UI/UX, Psicologia das Cores e capturas de tela).

