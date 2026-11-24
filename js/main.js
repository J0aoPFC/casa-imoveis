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

  // 2. Redimensionamento de Fonte (WCAG 1.4.4) com Persistência
  let currentFontSize = Number(localStorage.getItem('joaofialho-fontsize')) || 16;
  updateFontSize(currentFontSize);

  function updateFontSize(newSize) {
    currentFontSize = Math.min(22, Math.max(13, newSize));
    htmlEl.style.setProperty('--font-size-root', `${currentFontSize}px`);
    localStorage.setItem('joaofialho-fontsize', String(currentFontSize));
  }

  if (fontIncreaseBtn) fontIncreaseBtn.addEventListener('click', () => updateFontSize(currentFontSize + 1));
  if (fontDecreaseBtn) fontDecreaseBtn.addEventListener('click', () => updateFontSize(currentFontSize - 1));
  if (fontResetBtn) fontResetBtn.addEventListener('click', () => updateFontSize(16));

  // 3. Abas WAI-ARIA, Filtros Reais e Favoritos Persistentes
  const tabs = document.querySelectorAll('.search-tab');
  const searchForm = document.getElementById('panel-busca');
  const labelFaixa = document.getElementById('label-faixa');
  const selectFaixa = document.getElementById('select-faixa');
  const feedbackEl = document.getElementById('search-feedback');
  const propertyCards = document.querySelectorAll('.property-card');
  const vitrineCountEl = document.getElementById('vitrine-count');
  const emptyStateEl = document.getElementById('vitrine-empty');
  const filterFavsBtn = document.getElementById('btn-filter-favs');
  const favCountEl = document.getElementById('fav-count');
  const resetFiltersBtn = document.getElementById('btn-reset-filters');
  const emptyResetBtn = document.getElementById('btn-empty-reset');

  let savedFavs = JSON.parse(localStorage.getItem('joaofialho-favs') || '[]');
  let onlyFavorites = false;

  const faixaOptions = {
    todos: {
      label: 'Faixa de Investimento',
      options: [
        { value: 'todas', text: 'Qualquer valor' },
        { value: 'faixa-1', text: 'Até R$ 1.500.000 / R$ 3.000 mês' },
        { value: 'faixa-2', text: 'R$ 1.500.000 a R$ 2.500.000' },
        { value: 'faixa-3', text: 'Acima de R$ 2.500.000' }
      ]
    },
    comprar: {
      label: 'Faixa de Aquisição',
      options: [
        { value: 'todas', text: 'Qualquer valor' },
        { value: 'faixa-1', text: 'Até R$ 1.500.000' },
        { value: 'faixa-2', text: 'R$ 1.500.000 a R$ 2.500.000' }
      ]
    },
    alugar: {
      label: 'Faixa de Locação Mensal',
      options: [
        { value: 'todas', text: 'Qualquer valor' },
        { value: 'faixa-1', text: 'Até R$ 3.000/mês' },
        { value: 'faixa-2', text: 'Acima de R$ 3.000/mês' }
      ]
    },
    lancamentos: {
      label: 'Faixa do Lançamento',
      options: [
        { value: 'todas', text: 'Todos os lançamentos' },
        { value: 'faixa-1', text: 'Até R$ 1.500.000' },
        { value: 'faixa-3', text: 'Coberturas Signature (+R$ 2,5M)' }
      ]
    }
  };

  function syncFavoritesUI() {
    if (favCountEl) favCountEl.textContent = String(savedFavs.length);
    propertyCards.forEach((card) => {
      const id = card.dataset.id;
      const btn = card.querySelector('.btn-fav');
      const isFav = savedFavs.includes(id);
      if (btn) {
        btn.classList.toggle('is-saved', isFav);
        btn.setAttribute('aria-pressed', String(isFav));
        btn.textContent = isFav ? '♥' : '♡';
      }
    });
  }

  function filterProperties() {
    if (!propertyCards.length) return;
    const activeTab = document.querySelector('.search-tab.is-active');
    const mode = activeTab ? activeTab.dataset.mode : 'todos';
    const query = (document.getElementById('input-localizacao')?.value || '').trim().toLowerCase();
    const type = document.getElementById('select-tipo')?.value || 'todos';
    const tier = selectFaixa ? selectFaixa.value : 'todas';

    let visibleCount = 0;
    propertyCards.forEach((card) => {
      const matchMode = mode === 'todos' || card.dataset.mode === mode;
      const matchType = type === 'todos' || card.dataset.type === type;
      const matchTier = tier === 'todas' || card.dataset.tier === tier;
      const matchLoc = !query || card.dataset.location.includes(query) || card.textContent.toLowerCase().includes(query);
      const matchFav = !onlyFavorites || savedFavs.includes(card.dataset.id);

      if (matchMode && matchType && matchTier && matchLoc && matchFav) {
        card.classList.remove('is-hidden');
        visibleCount++;
      } else {
        card.classList.add('is-hidden');
      }
    });

    if (vitrineCountEl) {
      vitrineCountEl.textContent = `Exibindo ${visibleCount} de ${propertyCards.length} imóveis selecionados`;
    }
    if (emptyStateEl) {
      emptyStateEl.hidden = visibleCount > 0;
    }
    if (feedbackEl) {
      feedbackEl.textContent = `${visibleCount} imóvel(is) encontrado(s) no acervo para os critérios selecionados.`;
    }
  }

  function resetAllFilters() {
    onlyFavorites = false;
    if (filterFavsBtn) {
      filterFavsBtn.classList.remove('is-active');
      filterFavsBtn.setAttribute('aria-pressed', 'false');
    }
    const locInput = document.getElementById('input-localizacao');
    const tipoSelect = document.getElementById('select-tipo');
    if (locInput) locInput.value = '';
    if (tipoSelect) tipoSelect.value = 'todos';

    tabs.forEach((t, idx) => {
      const isFirst = idx === 0;
      t.classList.toggle('is-active', isFirst);
      t.setAttribute('aria-selected', String(isFirst));
    });
    if (labelFaixa) labelFaixa.textContent = faixaOptions.todos.label;
    if (selectFaixa) {
      selectFaixa.innerHTML = faixaOptions.todos.options
        .map((opt) => `<option value="${opt.value}">${opt.text}</option>`)
        .join('');
    }
    filterProperties();
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

  if (filterFavsBtn) {
    filterFavsBtn.addEventListener('click', () => {
      onlyFavorites = !onlyFavorites;
      filterFavsBtn.classList.toggle('is-active', onlyFavorites);
      filterFavsBtn.setAttribute('aria-pressed', String(onlyFavorites));
      filterProperties();
    });
  }

  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

  document.querySelectorAll('.btn-fav').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.property-card');
      const id = card?.dataset.id;
      if (!id) return;
      if (savedFavs.includes(id)) {
        savedFavs = savedFavs.filter((item) => item !== id);
      } else {
        savedFavs.push(id);
      }
      localStorage.setItem('joaofialho-favs', JSON.stringify(savedFavs));
      syncFavoritesUI();
      if (onlyFavorites) filterProperties();
    });
  });

  syncFavoritesUI();

  // 4. Carrossel Interativo de Empreendimentos
  const carouselEl = document.getElementById('empreendimentos-carousel');
  const slides = document.querySelectorAll('.carousel__slide');
  const dots = document.querySelectorAll('.carousel__dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const counterEl = document.getElementById('carousel-counter');
  let currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === currentSlide));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === currentSlide));
    if (counterEl) counterEl.textContent = `${currentSlide + 1} / ${slides.length}`;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => showSlide(Number(dot.dataset.goto)));
  });

  if (carouselEl) {
    carouselEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
      if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
    });
  }

  // 5. Preencher Formulário de Contato ao Clicar nos Cartões
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

  // 6. Validação e Feedback do Formulário de Contato
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

  // 7. Página de Login (login.html)
  const loginForm = document.getElementById('login-form');
  const togglePassBtn = document.getElementById('btn-toggle-pass');
  const passInput = document.getElementById('login-senha');
  const loginFeedback = document.getElementById('login-feedback');
  const portalPreview = document.getElementById('portal-preview');
  const portalPreviewTitle = document.getElementById('portal-preview-title');
  const portalPreviewList = document.getElementById('portal-preview-list');

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
      const usuario = document.getElementById('login-email').value.trim();
      if (loginFeedback) {
        loginFeedback.textContent = `Sessão autenticada para ${usuario} (${perfil}).`;
      }
      if (portalPreview && portalPreviewTitle && portalPreviewList) {
        portalPreview.hidden = false;
        portalPreviewTitle.textContent = `Painel — ${perfil}`;
        portalPreviewList.innerHTML = `
          <li>• <strong>Empreendimento Vinculado:</strong> Palazzo Horizonte Noroeste (SQNW 109)</li>
          <li>• <strong>Status Financeiro:</strong> Parcelas em dia • Próximo vencimento: 10/12/2026</li>
          <li>• <strong>Documentação:</strong> Escritura e Memorial Descritivo disponíveis para download</li>
        `;
      }
    });
  }
});
