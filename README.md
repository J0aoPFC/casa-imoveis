# JoãoFialho Incorporações & Imóveis — Projeto Final (Desenvolvimento de Interfaces 2/2026)

* **Instituição:** Centro Universitário de Brasília (UniCEUB)
* **Disciplina:** Desenvolvimento de Interfaces — 2/2026
* **Professor:** Prof. Dr. Felipe Batista da Silva
* **Aluno:** João Pedro Fialho Campos (RA: 22605006)
* **Site Publicado (GitHub Pages):** https://j0aopfc.github.io/casa-imoveis/

## Estrutura do Projeto
* `index.html` — Portal completo com barra de acessibilidade, cabeçalho com monograma vetorial `JF`, banner editorial com abas de pesquisa WAI-ARIA, carrossel de empreendimentos, grade de cartões filtráveis com sistema de favoritos, pilares institucionais, formulário de contato (*Private Desk*) e rodapé corporativo.
* `login.html` — Área do Cliente com seleção de perfil, alternância de visibilidade de senha e visualização simulada da carteira.
* `css/variables.css` — Tokens de design da Rota B (*Luxo e Exclusividade*) com suporte a Modo Claro (*Areia Travertino* `#F5F2EB`) e Modo Escuro (*Obsidiana* `#090D16`) em conformidade com WCAG 2.1 (AA/AAA).
* `css/style.css` — Estilização responsiva (*CSS Grid* e *Flexbox*), tipografia *Cormorant Garamond* + *Inter* e indicadores de foco visível.
* `js/main.js` — Persistência de tema e tamanho de fonte (`localStorage`), filtragem em tempo real por modalidade/localização/tipologia/faixa, favoritos persistentes, controle de carrossel e validação de formulários.
