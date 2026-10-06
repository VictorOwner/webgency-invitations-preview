(() => {
  'use strict';
  const eventDate = new Date('2027-06-19T16:00:00+03:00');
  const days = document.querySelector('#days');
  const hours = document.querySelector('#hours');
  const minutes = document.querySelector('#minutes');
  function countdown() {
    const remaining = Math.max(0, Math.floor((eventDate.getTime() - Date.now()) / 60000));
    days.textContent = String(Math.floor(remaining / 1440));
    hours.textContent = String(Math.floor((remaining % 1440) / 60)).padStart(2, '0');
    minutes.textContent = String(remaining % 60).padStart(2, '0');
  }
  countdown();
  setInterval(countdown, 60000);
  const form = document.querySelector('#rsvp');
  const stepBox = document.querySelector('#form-step');
  const progress = document.querySelector('#progress');
  const progressFill = document.querySelector('#progress-fill');
  const error = document.querySelector('#form-error');
  const back = document.querySelector('#back');
  const next = document.querySelector('#next');
  let values = {}, step = 0, done = false;
  const allSteps = ['status', 'name', 'count', 'meal', 'transfer', 'contact', 'review'];
  const activeSteps = () => values.status === 'no' ? ['status', 'name', 'contact', 'review'] : allSteps;
  const esc = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const choice = (name, value, text) => `<label class="choice"><input type="radio" name="${name}" value="${value}" ${values[name] === value ? 'checked' : ''}><span>${text}</span></label>`;
  const input = (name, type, label, hint, max) => `<label class="field-label" for="field-${name}">${label}</label><input id="field-${name}" name="${name}" type="${type}" maxlength="${max}" value="${esc(values[name] || '')}" placeholder="${hint}" autocomplete="off">`;
  function render() {
    error.textContent = '';
    const list = activeSteps();
    step = Math.min(step, list.length - 1);
    const key = list[step];
    progress.textContent = `${step + 1} / ${list.length}`;
    progressFill.style.width = `${(step + 1) * 100 / list.length}%`;
    back.hidden = step === 0 || done;
    next.innerHTML = key === 'review' ? 'Завершить демо <span>↗</span>' : 'Продолжить <span>↗</span>';
    next.hidden = done;
    const screens = {
      status: `<div class="form-question"><h3>Вы сможете прийти?</h3><p>Выберите ответ для просмотра демонстрационного сценария.</p><div class="choices">${choice('status','yes','Да, буду с вами')}${choice('status','no','К сожалению, не смогу')}</div></div>`,
      name: `<div class="form-question"><h3>Как к вам обращаться?</h3><p>Используйте вымышленное имя для демонстрации.</p>${input('name','text','Имя *','Например, Гость',80)}</div>`,
      count: `<div class="form-question"><h3>Сколько будет гостей?</h3><p>Включая вас. В настоящем приглашении предел задаётся парой.</p><label class="field-label" for="field-count">Количество гостей</label><select id="field-count" name="count">${[1,2,3,4].map(n=>`<option value="${n}" ${String(values.count || 1) === String(n) ? 'selected':''}>${n}</option>`).join('')}</select></div>`,
      meal: `<div class="form-question"><h3>Что подать к ужину?</h3><p>Это пожелание к меню, а не медицинская анкета.</p><div class="choices">${choice('meal','classic','Классическое меню')}${choice('meal','vegetarian','Вегетарианское меню')}</div></div>`,
      transfer: `<div class="form-question"><h3>Нужен трансфер?</h3><p>Маршрут демонстрационный, место встречи будет уточняться.</p><div class="choices">${choice('transfer','yes','Да, хотелось бы место')}${choice('transfer','no','Нет, доберусь самостоятельно')}</div></div>`,
      contact: `<div class="form-question"><h3>Как с вами связаться?</h3><p>Не вводите реальные контакты — этот прототип никуда их не отправит. Поле необязательное.</p>${input('contact','text','Демо-контакт','Например, @fictional_guest',100)}</div>`,
      review: `<div class="form-question"><h3>Проверим ответ</h3><p>Следующее действие лишь завершит демонстрацию. Ответ не будет сохранён или отправлен.</p><div class="review"><b>Присутствие:</b> ${values.status === 'yes' ? 'приду' : 'не смогу'}<br><b>Имя:</b> ${esc(values.name)}${values.status === 'yes' ? `<br><b>Гостей:</b> ${esc(values.count || '1')}<br><b>Меню:</b> ${values.meal === 'vegetarian' ? 'вегетарианское' : 'классическое'}<br><b>Трансфер:</b> ${values.transfer === 'yes' ? 'нужен' : 'не нужен'}` : ''}<br><b>Демо-контакт:</b> ${esc(values.contact || 'не указан')}</div></div>`
    };
    stepBox.innerHTML = screens[key];
  }
  function collect() {
    stepBox.querySelectorAll('input:checked,input[type="text"],select').forEach(el => values[el.name] = el.value.trim());
  }
  function validate(key) {
    if (key === 'status' && !values.status) return 'Выберите, сможете ли прийти.';
    if (key === 'name' && !values.name) return 'Укажите вымышленное имя для демо.';
    if (key === 'meal' && !values.meal) return 'Выберите вариант меню.';
    if (key === 'transfer' && !values.transfer) return 'Выберите ответ о трансфере.';
    return '';
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (done) return;
    const key = activeSteps()[step];
    collect();
    const message = validate(key);
    if (message) { error.textContent = message; stepBox.querySelector('input,select')?.focus(); return; }
    if (key === 'review') {
      done = true;
      values = {};
      stepBox.innerHTML = '<div class="complete" role="status"><h3>Демо завершено</h3><p>Ничего не было отправлено или сохранено. Организаторы не получили ответ. В настоящем приглашении после отправки здесь появилось бы подтверждение.</p></div>';
      next.hidden = true;
      back.hidden = true;
      progress.textContent = 'Демо завершено';
      return;
    }
    step++;
    render();
  });
  back.addEventListener('click', () => { if(step > 0) { collect(); step--; render(); } });
  render();
})();
