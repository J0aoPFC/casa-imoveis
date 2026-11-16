document.addEventListener('DOMContentLoaded', () => {
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('btn-theme-toggle');
  const fontIncreaseBtn = document.getElementById('btn-font-increase');
  const fontDecreaseBtn = document.getElementById('btn-font-decrease');
  const fontResetBtn = document.getElementById('btn-font-reset');

  // 1. Persistência de Tema (Claro Travertino / Escuro Obsidiana)
  const savedTheme = localStorage.getItem('joaofialho-theme') || 'light';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('joaofialho-theme', theme);
    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute('aria-pressed', String(isDark));
      themeToggleBtn.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  // 2. Redimensionamento de Fonte (WCAG 1.4.4)
  let currentFontSize = 16;
  function updateFontSize(newSize) {
    currentFontSize = Math.min(22, Math.max(13, newSize));
    htmlEl.style.setProperty('--font-size-root', `${currentFontSize}px`);
  }

  if (fontIncreaseBtn) fontIncreaseBtn.addEventListener('click', () => updateFontSize(currentFontSize + 1));
  if (fontDecreaseBtn) fontDecreaseBtn.addEventListener('click', () => updateFontSize(currentFontSize - 1));
  if (fontResetBtn) fontResetBtn.addEventListener('click', () => updateFontSize(16));

  // 3. Abas WAI-ARIA e Simulação de Filtro (Etapa 1)
  const tabs = document.querySelectorAll('.search-tab');
  const searchForm = document.getElementById('panel-busca');
  const labelFaixa = document.getElementById('label-faixa');
  const selectFaixa = document.getElementById('select-faixa');
  const feedbackEl = document.getElementById('search-feedback');

  const faixaOptions = {
    comprar: {
      label: 'Faixa de Aquisição',
      options: [
        { value: 'ate-1200k', text: 'Até R$ 1.200.000' },
        { value: '1200k-2500k', text: 'R$ 1.200.000 a R$ 2.500.000' },
        { value: 'acima-2500k', text: 'Acima de R$ 2.500.000' }
      ]
    },
    alugar: {
      label: 'Faixa de Locação Mensal',
      options: [
        { value: 'ate-3k', text: 'Até R$ 3.000/mês' },
        { value: '3k-6k', text: 'R$ 3.000 a R$ 6.000/mês' },
        { value: 'acima-6k', text: 'Acima de R$ 6.000/mês' }
      ]
    },
    lancamentos: {
      label: 'Estágio da Obra',
      options: [
        { value: 'planta', text: 'Na Planta' },
        { value: 'obras', text: 'Em Obras' },
        { value: 'pronto', text: 'Pronto para Morar' }
      ]
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      if (searchForm) searchForm.setAttribute('aria-labelledby', tab.id);

      const mode = tab.dataset.mode;
      const config = faixaOptions[mode];
      if (labelFaixa && config) labelFaixa.textContent = config.label;
      if (selectFaixa && config) {
        selectFaixa.innerHTML = config.options
          .map((opt) => `<option value="${opt.value}">${opt.text}</option>`)
          .join('');
      }
      if (feedbackEl) feedbackEl.textContent = '';
    });
  });

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const activeTab = document.querySelector('.search-tab.is-active')?.textContent.trim() || 'Comprar';
      const local = document.getElementById('input-localizacao')?.value.trim() || 'Brasília - DF';
      const tipo = document.getElementById('select-tipo')?.selectedOptions[0]?.text || 'Todas as tipologias';
      if (feedbackEl) {
        feedbackEl.textContent = `Parâmetros registrados [${activeTab}]: ${tipo} em "${local}". A grade completa de resultados será carregada na Etapa 2.`;
      }
    });
  }
});
