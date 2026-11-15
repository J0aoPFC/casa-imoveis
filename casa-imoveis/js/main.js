document.addEventListener('DOMContentLoaded', () => {
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('btn-theme-toggle');
  const fontIncreaseBtn = document.getElementById('btn-font-increase');
  const fontDecreaseBtn = document.getElementById('btn-font-decrease');
  const fontResetBtn = document.getElementById('btn-font-reset');

  const savedTheme = localStorage.getItem('casaimoveis-theme') || 'light';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('casaimoveis-theme', theme);
    const isDark = theme === 'dark';
    themeToggleBtn.setAttribute('aria-pressed', String(isDark));
    themeToggleBtn.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro';
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
  });

  let currentFontSize = 16;

  function updateFontSize(newSize) {
    currentFontSize = Math.min(22, Math.max(13, newSize));
    htmlEl.style.setProperty('--font-size-root', `${currentFontSize}px`);
  }

  fontIncreaseBtn.addEventListener('click', () => updateFontSize(currentFontSize + 1));
  fontDecreaseBtn.addEventListener('click', () => updateFontSize(currentFontSize - 1));
  fontResetBtn.addEventListener('click', () => updateFontSize(16));

  const tabs = document.querySelectorAll('.search-tab');
  const searchForm = document.getElementById('panel-busca');
  const labelFaixa = document.getElementById('label-faixa');
  const selectFaixa = document.getElementById('select-faixa');
  const feedbackEl = document.getElementById('search-feedback');

  const faixaOptions = {
    comprar: {
      label: 'Faixa de Valor (Compra)',
      options: [
        { value: 'ate-400k', text: 'Até R$ 400.000' },
        { value: '400k-800k', text: 'R$ 400.000 a R$ 800.000' },
        { value: 'acima-800k', text: 'Acima de R$ 800.000' }
      ]
    },
    alugar: {
      label: 'Faixa de Aluguel Mensal',
      options: [
        { value: 'ate-2k', text: 'Até R$ 2.000/mês' },
        { value: '2k-4k', text: 'R$ 2.000 a R$ 4.000/mês' },
        { value: 'acima-4k', text: 'Acima de R$ 4.000/mês' }
      ]
    },
    lancamentos: {
      label: 'Previsão de Entrega',
      options: [
        { value: 'pronto', text: 'Pronto para morar' },
        { value: '2027', text: 'Entrega em 2027' },
        { value: 'na-planta', text: 'Na planta' }
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
      searchForm.setAttribute('aria-labelledby', tab.id);

      const mode = tab.dataset.mode;
      const config = faixaOptions[mode];
      labelFaixa.textContent = config.label;
      selectFaixa.innerHTML = config.options
        .map((opt) => `<option value="${opt.value}">${opt.text}</option>`)
        .join('');
      feedbackEl.textContent = '';
    });
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const activeTab = document.querySelector('.search-tab.is-active').textContent.trim();
    const local = document.getElementById('input-localizacao').value.trim();
    const tipo = document.getElementById('select-tipo').selectedOptions[0].text;
    feedbackEl.textContent = `Filtro aplicado [${activeTab}]: ${tipo} em "${local}". Os resultados em cartões serão carregados na Etapa 2.`;
  });
});
