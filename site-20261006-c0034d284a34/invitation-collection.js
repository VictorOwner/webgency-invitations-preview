(function () {
  var themes = {
    sacred: { title: 'Священный сад', look: 'natural', openEyebrow: 'ПИСЬМО ИЗ САДА', openLabel: 'Открыть приглашение', openHint: 'Коснитесь свадебной печати' },
    velvet: { title: 'Бархатный вечер', look: 'burgundy', openEyebrow: 'ОДИН ОСОБЕННЫЙ ВЕЧЕР', openLabel: 'Войти в вечер', openHint: 'Двери откроются перед вами' },
    silk: { title: 'Воздушный шёлк', look: 'pastel', openEyebrow: 'САМОЕ НЕЖНОЕ «ДА»', openLabel: 'Прикоснуться', openHint: 'Раздвиньте шёлковую вуаль' },
    moon: { title: 'Лунный сад', look: 'blacktie', openEyebrow: 'ПОД ОДНИМ НЕБОМ', openLabel: 'Зажечь звёзды', openHint: 'Откройте нашу ночь' },
    estate: { title: 'Русская усадьба', look: 'natural', openEyebrow: 'ЛИЧНОЕ ПИСЬМО ДЛЯ ВАС', openLabel: 'Распечатать письмо', openHint: 'Коснитесь сургучной печати' },
    editorial: { title: 'Современная клятва', look: 'blacktie', openEyebrow: 'PRIVATE EDITION', openLabel: 'Открыть выпуск', openHint: 'Wedding issue · 14.09.26' }
  };
  var params = new URLSearchParams(location.search);
  var theme = params.get('theme') || 'sacred';
  if (!themes[theme]) theme = 'sacred';
  var config = themes[theme];
  var pickerMode = params.get('picker') === '1';

  document.body.dataset.theme = theme;
  document.body.classList.toggle('picker-mode', pickerMode);
  document.title = config.title + ' — пример приглашения';

  var opening = document.querySelector('#opening');
  var openingButton = document.querySelector('#opening-button');
  var invite = document.querySelector('#invite');
  document.querySelector('#opening-eyebrow').textContent = config.openEyebrow;
  document.querySelector('#opening-label').textContent = config.openLabel;
  document.querySelector('#opening-hint').textContent = config.openHint;
  document.querySelector('#opening-title').setAttribute('aria-label', 'Роман и Полина');
  document.querySelector('.hero h1').setAttribute('aria-label', 'Роман и Полина');
  document.body.classList.add('opening-lock');
  invite.inert = true;
  invite.setAttribute('aria-hidden', 'true');

  function openInvitation() {
    if (opening.classList.contains('is-opening')) return;
    opening.classList.add('is-opening');
    openingButton.disabled = true;
    window.setTimeout(function () {
      document.body.classList.remove('opening-lock');
      document.body.classList.add('opening-revealed');
      invite.inert = false;
      invite.removeAttribute('aria-hidden');
    }, 650);
    window.setTimeout(function () {
      opening.classList.add('is-gone');
      opening.setAttribute('aria-hidden', 'true');
      document.querySelector('.hero h1').focus({ preventScroll: true });
    }, 1250);
  }

  openingButton.addEventListener('click', openInvitation);
  openingButton.disabled = false;
  openingButton.removeAttribute('aria-busy');
  document.documentElement.dataset.invitationReady = 'true';
  window.setTimeout(function () { openingButton.focus({ preventScroll: true }); }, 50);

  var storyImage = document.querySelector('.story-photo img');
  if (storyImage) storyImage.src = 'assets/themes/' + theme + '-hero.webp';

  var themeColors = { sacred: '#061f19', velvet: '#250811', silk: '#f3e3df', moon: '#071126', estate: '#28453a', editorial: '#f8f7f1' };
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute('content', themeColors[theme] || themeColors.sacred);

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('motion-ready');
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.panel:not(.hero)').forEach(function (panel) { revealObserver.observe(panel); });
  }

  var collectionCta = document.querySelector('#collection-cta');
  if (collectionCta) collectionCta.href = 'auth.html?mode=register&theme=' + encodeURIComponent(theme);
  if (pickerMode && collectionCta) {
    collectionCta.textContent = 'Выбрать это приглашение';
    document.querySelector('#end-note').textContent = 'Вы посмотрели приглашение целиком. Хотите продолжить с этим дизайном?';
    collectionCta.href = '#';
    collectionCta.removeAttribute('target');
    collectionCta.addEventListener('click', function (event) {
      event.preventDefault();
      if (window.parent !== window) window.parent.postMessage({ type: 'wg-template-select', theme: theme }, location.origin);
      else location.href = 'account.html';
    });
  }

  var look = document.querySelector('#look img');
  var lookCount = document.querySelector('#look-count');
  var lookGroup = 'women';
  var lookIndex = 0;
  var lookRequest = 0;

  function renderLook() {
    var groupName = lookGroup === 'women' ? 'Женский' : 'Мужской';
    var nextSrc = 'assets/dress-code/looks/' + config.look + '/' + lookGroup + '-' + (lookIndex + 1) + '.jpg';
    var nextAlt = groupName + ' образ ' + (lookIndex + 1) + ' из 5';
    var request = ++lookRequest;
    var preload = new Image();
    look.setAttribute('aria-busy', 'true');
    preload.onload = function () {
      if (request !== lookRequest) return;
      look.src = nextSrc;
      look.alt = nextAlt;
      look.removeAttribute('aria-busy');
    };
    preload.onerror = function () {
      if (request !== lookRequest) return;
      look.removeAttribute('aria-busy');
    };
    preload.src = nextSrc;
    lookCount.textContent = (lookIndex + 1) + ' из 5';
    document.querySelectorAll('[data-dress]').forEach(function (button) {
      var active = button.dataset.dress === lookGroup;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function moveLook(direction) {
    lookIndex = (lookIndex + direction + 5) % 5;
    renderLook();
    look.animate([{ opacity: 0.45 }, { opacity: 1 }], { duration: 220 });
  }

  document.querySelectorAll('[data-dress]').forEach(function (button) {
    button.addEventListener('click', function () {
      lookGroup = button.dataset.dress;
      lookIndex = 0;
      renderLook();
    });
  });
  document.querySelectorAll('[data-look-move]').forEach(function (button) {
    button.addEventListener('click', function () { moveLook(Number(button.dataset.lookMove)); });
  });

  document.querySelectorAll('[data-reserve]').forEach(function (button) {
    button.addEventListener('click', function () {
      var reserved = button.classList.toggle('reserved');
      button.textContent = reserved ? 'Забронировано ✓' : 'Забронировать';
      button.setAttribute('aria-pressed', reserved ? 'true' : 'false');
    });
  });
  var lookPointerX = 0;
  document.querySelector('#look').addEventListener('pointerdown', function (event) { lookPointerX = event.clientX; });
  document.querySelector('#look').addEventListener('pointerup', function (event) {
    var delta = event.clientX - lookPointerX;
    if (Math.abs(delta) > 45) moveLook(delta < 0 ? 1 : -1);
  });
  renderLook();

  function tick() {
    var target = new Date('2026-09-14T16:00:00');
    var diff = Math.max(0, target - Date.now());
    var parts = [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60];
    document.querySelectorAll('#countdown b').forEach(function (el, index) { el.textContent = String(parts[index]).padStart(2, '0'); });
  }
  tick();
  setInterval(tick, 1000);

  var modal = document.querySelector('#rsvp-modal');
  var form = document.querySelector('#rsvp-form');
  var stepRoot = document.querySelector('#rsvp-step');
  var progressLabel = document.querySelector('#rsvp-progress-label');
  var progressBar = document.querySelector('#rsvp-progress-bar');
  var errorBox = document.querySelector('#rsvp-error');
  var actions = document.querySelector('#rsvp-actions');
  var backButton = document.querySelector('#rsvp-back');
  var nextButton = document.querySelector('#rsvp-next');
  var savedScrollY = 0;
  var lastRsvpTrigger = null;
  var rsvpIndex = 0;
  var rsvpData = {};

  var messengerCopy = {
    telegram: { title: 'Telegram', mark: 'TG', label: 'Ваш контакт в Telegram', placeholder: '@username или ссылка t.me/…' },
    whatsapp: { title: 'WhatsApp', mark: 'WA', label: 'Ваш контакт в WhatsApp', placeholder: '+7 999 000-00-00 или ссылка wa.me/…' },
    max: { title: 'MAX', mark: 'MAX', label: 'Ваш контакт в MAX', placeholder: '@username или ссылка на профиль' }
  };

  function rsvpSteps() {
    var base = ['attendance', 'name', 'messenger'];
    if (!rsvpData.attendance || rsvpData.attendance === 'yes') return base.concat(['party', 'menu', 'transfer']);
    return base.concat(['comment']);
  }

  function option(value, icon, title, copy, selected) {
    return '<button type="button" class="rsvp-choice' + (selected ? ' selected' : '') + '" data-rsvp-value="' + value + '" aria-pressed="' + (selected ? 'true' : 'false') + '"><span>' + icon + '</span><b>' + title + '</b><small>' + copy + '</small><i>✓</i></button>';
  }

  function inputValue(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderRsvpStep() {
    var steps = rsvpSteps();
    if (rsvpIndex >= steps.length) rsvpIndex = steps.length - 1;
    var key = steps[rsvpIndex];
    var total = steps.length;
    progressLabel.textContent = 'Вопрос ' + (rsvpIndex + 1) + ' из ' + total;
    progressBar.style.width = ((rsvpIndex + 1) / total * 100) + '%';
    backButton.hidden = rsvpIndex === 0;
    nextButton.textContent = rsvpIndex === total - 1 ? 'Отправить ответ' : 'Продолжить';
    actions.hidden = false;
    errorBox.hidden = true;
    errorBox.textContent = '';

    if (key === 'attendance') {
      stepRoot.innerHTML = '<p class="rsvp-eyebrow">ПОДТВЕРЖДЕНИЕ ПРИСУТСТВИЯ</p><h2 id="rsvp-title">Вы будете с нами?</h2><p class="rsvp-lead">Выберите один вариант. Его всегда можно изменить позже.</p><div class="rsvp-choice-grid">' +
        option('yes', '✓', 'Буду', 'С радостью приду', rsvpData.attendance === 'yes') +
        option('maybe', '?', 'Пока не уверен', 'Отвечу точнее позже', rsvpData.attendance === 'maybe') +
        option('no', '×', 'Не смогу', 'Передам тёплые пожелания', rsvpData.attendance === 'no') + '</div>';
    } else if (key === 'name') {
      stepRoot.innerHTML = '<p class="rsvp-eyebrow">КАК К ВАМ ОБРАЩАТЬСЯ</p><h2 id="rsvp-title">Представьтесь, пожалуйста</h2><p class="rsvp-lead">Так молодожёны поймут, от кого пришёл ответ.</p><label class="rsvp-field"><span>Имя и фамилия</span><input name="guestName" autocomplete="name" inputmode="text" placeholder="Например, Алексей Петров" value="' + inputValue(rsvpData.name) + '"></label>';
    } else if (key === 'messenger') {
      var messenger = rsvpData.messenger && messengerCopy[rsvpData.messenger];
      stepRoot.innerHTML = '<p class="rsvp-eyebrow">УДОБНАЯ СВЯЗЬ</p><h2 id="rsvp-title">Где вам написать?</h2><p class="rsvp-lead">Выберите мессенджер, которым пользуетесь. Звонить не будем.</p><div class="messenger-grid">' +
        option('telegram', 'TG', 'Telegram', 'Написать в Telegram', rsvpData.messenger === 'telegram') +
        option('whatsapp', 'WA', 'WhatsApp', 'Написать в WhatsApp', rsvpData.messenger === 'whatsapp') +
        option('max', 'MAX', 'MAX', 'Написать в MAX', rsvpData.messenger === 'max') + '</div>' +
        (messenger ? '<label class="rsvp-field messenger-contact"><span>' + messenger.label + '</span><input name="messengerContact" inputmode="text" autocapitalize="off" autocomplete="off" placeholder="' + messenger.placeholder + '" value="' + inputValue(rsvpData.messengerContact) + '"><small>Контакт увидят только организаторы свадьбы.</small></label>' : '<p class="rsvp-select-hint">Сначала выберите удобный мессенджер</p>');
    } else if (key === 'party') {
      var adults = Number(rsvpData.adults || 1);
      stepRoot.innerHTML = '<p class="rsvp-eyebrow">ВАША КОМПАНИЯ</p><h2 id="rsvp-title">С кем вы придёте?</h2><p class="rsvp-lead">Укажите общее количество взрослых вместе с собой.</p><div class="rsvp-count" role="group" aria-label="Количество взрослых">' + [1, 2, 3, 4].map(function (number) { return '<button type="button" data-rsvp-count="' + number + '" class="' + (adults === number ? 'selected' : '') + '">' + number + '</button>'; }).join('') + '</div>' +
        (adults > 1 ? '<label class="rsvp-field"><span>Имена остальных взрослых</span><input name="companions" placeholder="Например, Анна Петрова" value="' + inputValue(rsvpData.companions) + '"></label>' : '') +
        '<label class="rsvp-toggle"><span><b>С вами будут дети?</b><small>Укажите количество, чтобы для них подготовили места</small></span><input type="checkbox" name="withChildren" ' + (rsvpData.withChildren ? 'checked' : '') + '><i></i></label>' +
        (rsvpData.withChildren ? '<div class="rsvp-count child-count" role="group" aria-label="Количество детей">' + [1, 2, 3].map(function (number) { return '<button type="button" data-rsvp-children="' + number + '" class="' + (Number(rsvpData.children || 1) === number ? 'selected' : '') + '">' + number + (number === 3 ? '+' : '') + '</button>'; }).join('') + '</div>' : '');
    } else if (key === 'menu') {
      stepRoot.innerHTML = '<p class="rsvp-eyebrow">МЕНЮ</p><h2 id="rsvp-title">Какое меню выбрать?</h2><p class="rsvp-lead">Выберите основной вариант для себя. Пожелания остальных гостей можно указать ниже.</p><div class="rsvp-choice-grid compact">' +
        option('classic', '◆', 'Классическое', 'Мясо и сезонный гарнир', rsvpData.menu === 'classic') +
        option('fish', '≈', 'Рыбное', 'Рыба и овощи', rsvpData.menu === 'fish') +
        option('vegetarian', '♧', 'Без мяса', 'Овощное меню', rsvpData.menu === 'vegetarian') + '</div>';
    } else if (key === 'transfer') {
      stepRoot.innerHTML = '<p class="rsvp-eyebrow">ТРАНСФЕР</p><h2 id="rsvp-title">Нужно место в автобусе?</h2><p class="rsvp-lead">Автобус отправится от метро в 15:00.</p><div class="rsvp-choice-grid two">' +
        option('yes', '→', 'Да, нужно', 'Поеду на трансфере', rsvpData.transfer === 'yes') +
        option('no', '⌂', 'Нет', 'Доберусь самостоятельно', rsvpData.transfer === 'no') + '</div>';
    } else if (key === 'comment') {
      stepRoot.innerHTML = '<p class="rsvp-eyebrow">ПОСЛЕДНИЙ ШАГ</p><h2 id="rsvp-title">Хотите что-то добавить?</h2><p class="rsvp-lead">Необязательно. Можно оставить пожелание или уточнение.</p><label class="rsvp-field"><span>Комментарий</span><textarea name="comment" placeholder="Ваше сообщение молодожёнам">' + inputValue(rsvpData.comment) + '</textarea></label>';
    }
    bindRsvpStep();
  }

  function selectValue(button) {
    var current = rsvpSteps()[rsvpIndex];
    var value = button.dataset.rsvpValue;
    if (current === 'attendance') rsvpData.attendance = value;
    if (current === 'messenger') { rsvpData.messenger = value; rsvpData.messengerContact = ''; }
    if (current === 'menu') rsvpData.menu = value;
    if (current === 'transfer') rsvpData.transfer = value;
    renderRsvpStep();
  }

  function bindRsvpStep() {
    stepRoot.querySelectorAll('[data-rsvp-value]').forEach(function (button) { button.addEventListener('click', function () { selectValue(button); }); });
    stepRoot.querySelectorAll('[data-rsvp-count]').forEach(function (button) { button.addEventListener('click', function () { rsvpData.adults = Number(button.dataset.rsvpCount); renderRsvpStep(); }); });
    stepRoot.querySelectorAll('[data-rsvp-children]').forEach(function (button) { button.addEventListener('click', function () { rsvpData.children = Number(button.dataset.rsvpChildren); renderRsvpStep(); }); });
    var childrenToggle = stepRoot.querySelector('[name="withChildren"]');
    if (childrenToggle) childrenToggle.addEventListener('change', function () { rsvpData.withChildren = childrenToggle.checked; if (childrenToggle.checked && !rsvpData.children) rsvpData.children = 1; renderRsvpStep(); });
    stepRoot.querySelectorAll('input,textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.name === 'guestName') rsvpData.name = field.value;
        if (field.name === 'messengerContact') rsvpData.messengerContact = field.value;
        if (field.name === 'companions') rsvpData.companions = field.value;
        if (field.name === 'comment') rsvpData.comment = field.value;
        errorBox.hidden = true;
      });
    });
  }

  function showRsvpError(message, selector) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    var field = selector && stepRoot.querySelector(selector);
    if (field) field.focus();
  }

  function validateRsvpStep() {
    var key = rsvpSteps()[rsvpIndex];
    if (key === 'attendance' && !rsvpData.attendance) return showRsvpError('Выберите, сможете ли вы прийти.'), false;
    if (key === 'name' && String(rsvpData.name || '').trim().length < 2) return showRsvpError('Напишите ваше имя.', '[name="guestName"]'), false;
    if (key === 'messenger' && !rsvpData.messenger) return showRsvpError('Выберите удобный мессенджер.'), false;
    if (key === 'messenger' && String(rsvpData.messengerContact || '').trim().length < 2) return showRsvpError('Укажите контакт в выбранном мессенджере.', '[name="messengerContact"]'), false;
    if (key === 'party' && Number(rsvpData.adults || 1) > 1 && String(rsvpData.companions || '').trim().length < 2) return showRsvpError('Напишите имена остальных взрослых.', '[name="companions"]'), false;
    if (key === 'menu' && !rsvpData.menu) return showRsvpError('Выберите подходящий вариант меню.'), false;
    if (key === 'transfer' && !rsvpData.transfer) return showRsvpError('Укажите, нужен ли вам трансфер.'), false;
    return true;
  }

  function showRsvpSuccess() {
    progressLabel.textContent = 'Готово';
    progressBar.style.width = '100%';
    actions.hidden = true;
    errorBox.hidden = true;
    var answer = rsvpData.attendance === 'yes' ? 'Организаторы увидят, что вы будете, и подготовят всё для вашей компании.' : rsvpData.attendance === 'maybe' ? 'Организаторы увидят, что вы пока не уверены, и смогут написать вам в выбранном мессенджере.' : 'Организаторы увидят ваш ответ и тёплые пожелания.';
    stepRoot.innerHTML = '<div class="rsvp-success"><span>✓</span><p class="rsvp-eyebrow">ОТВЕТ ПРИНЯТ</p><h2 id="rsvp-title">Спасибо, ' + inputValue(String(rsvpData.name || '').trim().split(' ')[0]) + '!</h2><p>' + answer + '</p><small>Это демонстрация — данные никуда не отправлены.</small><button type="button" class="button" id="rsvp-done">Вернуться в приглашение</button></div>';
    document.querySelector('#rsvp-done').addEventListener('click', closeRsvp);
  }

  function closeRsvp() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('rsvp-open');
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollY);
    if (lastRsvpTrigger) lastRsvpTrigger.focus({ preventScroll: true });
  }

  function openRsvp(event) {
    lastRsvpTrigger = event.currentTarget;
    savedScrollY = window.scrollY;
    rsvpData = { adults: 1, children: 1 };
    rsvpIndex = 0;
    renderRsvpStep();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('rsvp-open');
    document.body.style.overflow = 'hidden';
    window.setTimeout(function () { document.querySelector('#rsvp-close').focus({ preventScroll: true }); }, 100);
  }

  document.querySelector('#rsvp-open').addEventListener('click', openRsvp);
  document.querySelector('#rsvp-close').addEventListener('click', closeRsvp);
  modal.addEventListener('click', function (event) { if (event.target === modal) closeRsvp(); });
  document.addEventListener('keydown', function (event) {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') { closeRsvp(); return; }
    if (event.key !== 'Tab') return;
    var focusable = Array.from(modal.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])')).filter(function (element) { return element.getClientRects().length; });
    if (!focusable.length) { event.preventDefault(); return; }
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  backButton.addEventListener('click', function () { if (rsvpIndex > 0) { rsvpIndex -= 1; renderRsvpStep(); } });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!validateRsvpStep()) return;
    if (rsvpIndex === rsvpSteps().length - 1) showRsvpSuccess();
    else { rsvpIndex += 1; renderRsvpStep(); stepRoot.scrollTop = 0; }
  });
}());
