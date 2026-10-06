(() => {
  'use strict';
  const version='site-20261006-c0034d284a34';
  const storageKey='priglasim-review:'+version;
  const keys=['sacred','editor','themes','auth'];
  const titles={sacred:'Священный сад — гостевой экран',editor:'Конструктор — прогресс',themes:'Остальные пять тем',auth:'Ссылка «К шаблонам»'};
  const statuses={ok:'Всё устраивает',changes:'Нужны правки',skip:'Не проверял'};
  const state=document.querySelector('#save-state');
  function values(){const result={};for(const key of keys){result[key]={status:document.querySelector(`input[name="${key}"]:checked`)?.value||'',note:document.querySelector('#note-'+key).value.trim()}}return result}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(values()));state.textContent='Сохранено в этом браузере · ещё не передано';return true}catch{state.textContent='Не удалось сохранить в браузере. Проверьте настройки хранения.';return false}}
  try{const existing=JSON.parse(localStorage.getItem(storageKey)||'{}');for(const key of keys){const value=existing[key]||{};if(statuses[value.status])document.querySelector(`input[name="${key}"][value="${value.status}"]`).checked=true;document.querySelector('#note-'+key).value=typeof value.note==='string'?value.note.slice(0,280):''}if(Object.keys(existing).length)state.textContent='Черновик восстановлен из этого браузера · ещё не передан'}catch{state.textContent='Не удалось прочитать сохранённый черновик'}
  document.querySelectorAll('[data-save]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.save;save();button.textContent='Сохранено ✓';setTimeout(()=>button.textContent='Сохранить пункт',2400);if(!document.querySelector(`input[name="${key}"]:checked`))state.textContent='Комментарий сохранён, но выберите решение по пункту'}));
  document.querySelectorAll('input[type="radio"],textarea').forEach(el=>el.addEventListener('change',save));
  document.querySelector('#send-feedback').addEventListener('click',()=>{
    const data=values(); const missing=keys.find(key=>!statuses[data[key].status]);
    if(missing){state.textContent='Отметьте решение в каждом пункте (можно «Не проверял»).';document.querySelector('#'+missing).scrollIntoView({behavior:'smooth'});document.querySelector(`input[name="${missing}"]`).focus();return}
    if(!save())return;
    const body=['# Отзыв о версии '+version,'','Тестовая версия: https://victorowner.github.io/webgency-invitations-preview/'+version+'/review.html','Публичный просмотр с вымышленными данными; эта форма НЕ разрешает релиз на основной домен.',''];
    for(const key of keys){body.push('## '+titles[key],'- Решение: '+statuses[data[key].status],'- Комментарий: '+(data[key].note||'—'),'')}
    const issue='https://github.com/VictorOwner/webgency-invitations/issues/new?title='+encodeURIComponent('Отзыв владельца — '+version)+'&body='+encodeURIComponent(body.join('\n'));
    state.textContent='Открыта форма GitHub. Нажмите там Submit new issue, чтобы я получил отзыв.';
    const opened=window.open(issue,'_blank','noopener');
    if(!opened){state.textContent='Браузер заблокировал вкладку. Нажмите кнопку ещё раз или разрешите всплывающие окна.'}
  });
})();
