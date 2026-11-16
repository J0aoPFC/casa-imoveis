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

  // 3. Abas WAI-ARIA e Filtro de Imóveis
  const tabs = document.querySelectorAll('.search-tab');
  const searchForm = document.getElementById('panel-busca');
  const labelFaixa = document.getElementById('label-faixa');
  const selectFaixa = document.getElementById('select-faixa');
  const feedbackEl = document.getElementById('search-feedback');
  const propertyCards = document.querySelectorAll('.property-card');

  const faixaOptions = {
    todos: {
      label: 'Faixa de Investimento',
      options: [
        { value: 'todas', text: 'Qualquer valor' },
        { value: 'ate-1200k', text: 'Até R$ 1.200.000' },
        { value: '1200k-2500k', text: 'R$ 1.200.000 a R$ 2.500.000' },
        { value: 'acima-2500k', text: 'Acima de R$ 2.500.000' }
      ]
    },
    comprar: {
      label: 'Faixa de Aquisição',
      options: [
        { value: 'todas', text: 'Qualquer valor' },
        { value: 'ate-1500k', text: 'Até R$ 1.500.000' },
        { value: 'acima-1500k', text: 'Acima de R$ 1.500.000' }
      ]
    },
    alugar: {
      label: 'Faixa de Locação Mensal',
      options: [
        { value: 'todas', text: 'Qualquer valor' },
        { value: 'ate-3k', text: 'Até R$ 3.000/mês' },
        { value: 'acima-3k', text: 'Acima de R$ 3.000/mês' }
      ]
    },
    lancamentos: {
      label: 'Estágio da Obra',
      options: [
        { value: 'todas', text: 'Todos os estágios' },
        { value: 'planta', text: 'Na Planta' },
        { value: 'obras', text: 'Em Obras' }
      ]
    }
  };

  function filterProperties() {
    if (!propertyCards.length) return;
    const activeTab = document.querySelector('.search-tab.is-active');
    const mode = activeTab ? activeTab.dataset.mode : 'todos';
    const query = (document.getElementById('input-localizacao')?.value || '').trim().toLowerCase();
    const type = document.getElementById('select-tipo')?.value || 'todos';

    let visibleCount = 0;
    propertyCards.forEach((card) => {
      const matchMode = mode === 'todos' || card.dataset.mode === mode;
      const matchType = type === 'todos' || card.dataset.type === type;
      const matchLoc = !query || card.dataset.location.includes(query) || card.textContent.toLowerCase().includes(query);

      if (matchMode && matchType && matchLoc) {
        card.classList.remove('is-hidden');
        visibleCount++;
      } else {
        card.classList.add('is-hidden');
      }
    });

    if (feedbackEl) {
      feedbackEl.textContent = `${visibleCount} imóvel(is) encontrado(s) no acervo abaixo para o filtro selecionado.`;
    }
  }

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
      const config = faixaOptions[mode] || faixaOptions.todos;
      if (labelFaixa) labelFaixa.textContent = config.label;
      if (selectFaixa) {
        selectFaixa.innerHTML = config.options
          .map((opt) => `<option value="${opt.value}">${opt.text}</option>`)
          .join('');
      }
      filterProperties();
    });
  });

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      filterProperties();
      document.getElementById('vitrine')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 4. Carrossel de Empreendimentos
  const slides = document.querySelectorAll('.carousel__slide');
  const dots = document.querySelectorAll('.carousel__dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === currentSlide));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === currentSlide));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => showSlide(Number(dot.dataset.goto)));
  });

  // 5. Favoritar Imóveis e Preencher Private Desk
  document.querySelectorAll('.btn-fav').forEach((btn) => {
    btn.addEventListener('click', () => {
      const saved = btn.classList.toggle('is-saved');
      btn.setAttribute('aria-pressed', String(saved));
      btn.textContent = saved ? '♥' : '♡';
    });
  });

  document.querySelectorAll('.btn-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      const imovel = btn.dataset.imovel;
      const msgField = document.getElementById('contato-mensagem');
      if (msgField && imovel) {
        msgField.value = `Olá! Gostaria de receber o dossiê completo e agendar atendimento reservado para: ${imovel}.`;
      }
      document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 6. Formulário de Contato
  const contactForm = document.getElementById('contact-form');
  const contactFeedback = document.getElementById('contact-feedback');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('contato-nome').value.trim();
      const interesse = document.getElementById('contato-interesse').value;
      if (contactFeedback) {
        contactFeedback.textContent = `Agradecemos o contato, ${nome}. Um diretor comercial do Private Desk JoãoFialho responderá sua solicitação sobre "${interesse}" em breve.`;
      }
      contactForm.reset();
    });
  }

  // 7. Página de Login
  const loginForm = document.getElementById('login-form');
  const togglePassBtn = document.getElementById('btn-toggle-pass');
  const passInput = document.getElementById('login-senha');
  const loginFeedback = document.getElementById('login-feedback');

  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const isHidden = passInput.type === 'password';
      passInput.type = isHidden ? 'text' : 'password';
      togglePassBtn.textContent = isHidden ? 'Ocultar' : 'Mostrar';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const perfil = document.getElementById('login-perfil').value;
      if (loginFeedback) {
        loginFeedback.textContent = `Acesso autenticado para "${perfil}". Carregando painel exclusivo JoãoFialho...`;
      }
    });
  }
});
