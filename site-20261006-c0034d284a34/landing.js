(() => {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');

  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };

  menuToggle?.addEventListener('click', () => {
    const next = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(next));
    nav?.classList.toggle('is-open', next);
  });
  nav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (!nav?.classList.contains('is-open')) return;
    if (!event.target.closest('[data-header]')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const rotatingWord = document.querySelector('[data-rotating-word]');
  const words = ['с приглашения', 'с вашей истории', 'с момента «да»'];
  let wordIndex = 0;
  if (rotatingWord && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => {
      rotatingWord.classList.add('is-changing');
      setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        rotatingWord.textContent = words[wordIndex];
        rotatingWord.classList.remove('is-changing');
      }, 260);
    }, 3600);
  }

  const dialog = document.querySelector('[data-preview-dialog]');
  const frame = document.querySelector('[data-preview-frame]');
  const previewDevice = document.querySelector('[data-preview-device]');
  const title = document.querySelector('[data-preview-title]');
  const select = document.querySelector('[data-preview-select]');
  let opener = null;

  frame?.addEventListener('load', () => {
    if (frame.getAttribute('src') && frame.getAttribute('src') !== 'about:blank') {
      previewDevice?.setAttribute('data-loading', 'false');
    }
  });

  const closePreview = () => {
    if (!dialog?.open) return;
    dialog.close();
    document.body.classList.remove('modal-open');
    if (frame) frame.src = 'about:blank';
    previewDevice?.setAttribute('data-loading', 'true');
    opener?.focus();
  };

  document.querySelectorAll('[data-preview]').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('[data-theme]');
      if (!card || !dialog || !frame) return;
      const theme = card.dataset.theme;
      const name = card.dataset.name;
      opener = button;
      previewDevice?.setAttribute('data-loading', 'true');
      frame.src = `invitation-collection.html?theme=${encodeURIComponent(theme)}&preview=1`;
      if (title) title.textContent = name;
      if (select) select.href = `auth.html?mode=register&theme=${encodeURIComponent(theme)}`;
      document.body.classList.add('modal-open');
      dialog.showModal();
    });
  });

  document.querySelectorAll('[data-preview-close]').forEach((button) => button.addEventListener('click', closePreview));
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closePreview();
  });
  dialog?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closePreview();
  });
})();
