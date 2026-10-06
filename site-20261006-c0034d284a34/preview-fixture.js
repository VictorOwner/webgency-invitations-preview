// Preview-only fixture. No production API, personal data, or writes.
(() => {
  const themes=['sacred','velvet','silk','moon','estate','editorial'];
  const titles=['Священный сад','Бархатный вечер','Воздушный шёлк','Лунный сад','Русская усадьба','Современная клятва'];
  const richFields={storyText:'Синтетическая история для просмотра',dressText:'Цвета гостей',dressWomen:'Пример для гостей',dressMen:'Пример для гостей',faqQuestion1:'Как добраться?',faqAnswer1:'Маршрут указан выше.',contactName:'Тестовый координатор',contactText:'Только синтетические данные',contactTelegram:'@syntheticqa',menuOptions:'Классическое, Вегетарианское'};
  const data={nameOne:'Александра-Екатерина',nameTwo:'Константинопольский',date:'2027-06-19',time:'17:30',message:'Демонстрационное приглашение — без реальных гостей',venue:'Тестовая площадка',address:'Вымышленная улица, 1',schedule:[['16:00','Сбор гостей'],['17:30','Церемония'],['19:00','Ужин']],features:{countdown:true,story:true,dress:true,gifts:true,flowers:true,format:true,transfer:true,accommodation:true,menu:true,activities:true,prewedding:true,gallery:true,childhood:false,video:false,faq:true,contacts:true},giftItems:[{id:'demo-gift',title:'Демонстрационный подарок',price:'100 ₽'}],transferRoutes:[{time:'16:00',title:'Тестовый автобус',from:'А',to:'Б',seats:20}],accommodationOptions:[{name:'Тестовый отель',address:'Вымышленная улица, 2',price:'100 ₽'}],rsvpQuestions:{count:true,companions:true,children:true,meal:true,transfer:true},rsvpConfig:{maxGuests:4},customQuestions:['Нужна ли помощь?'],richFields};
  const realFetch=window.fetch.bind(window);
  window.fetch=(input,init={})=>{
    const path=new URL(typeof input==='string'?input:input.url,location.href).pathname;
    const method=(init.method || (typeof input==='string'?'GET':input.method) || 'GET').toUpperCase();
    const match=path.match(/\/api\/invitations\/([^/]+)$/);
    if(method==='GET' && match && themes.includes(match[1])) {
      const theme=match[1];
      return Promise.resolve(new Response(JSON.stringify({theme,project:{template:titles[themes.indexOf(theme)],data},reservedGiftIds:[]}),{status:200,headers:{'Content-Type':'application/json'}}));
    }
    if(path.includes('/api/') || method!=='GET') return Promise.resolve(new Response(JSON.stringify({error:'Демо: отправка и сохранение отключены'}),{status:403,headers:{'Content-Type':'application/json'}}));
    return realFetch(input,init);
  };
  document.addEventListener('DOMContentLoaded',()=>{
    for(const id of ['rsvp-form','gift-form']) document.getElementById(id)?.addEventListener('submit',e=>{
      e.preventDefault(); e.stopImmediatePropagation();
      const field=document.getElementById(id==='rsvp-form'?'rsvp-error':'gift-error');
      if(field) field.textContent='Демо: ответ не отправляется и не сохраняется.';
    },true);
  });
})();
