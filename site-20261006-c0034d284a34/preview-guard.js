// Preview only. Never forward account/payment/guest writes.
(() => {
 const originalFetch=window.fetch.bind(window);
 window.fetch=(input,init={})=>{
  const url=new URL(typeof input==='string'?input:input.url,location.href);
  const method=(init.method||(typeof input==='string'?'GET':input.method)||'GET').toUpperCase();
  if(method!=='GET')return Promise.resolve(new Response(JSON.stringify({error:'Демо: данные не сохраняются и не отправляются'}),{status:403,headers:{'Content-Type':'application/json'}}));
  if(url.pathname.endsWith('/api/account/state'))return Promise.resolve(new Response(JSON.stringify({state:null}),{status:200,headers:{'Content-Type':'application/json'}}));
  if(url.pathname.endsWith('/api/account'))return Promise.resolve(new Response(JSON.stringify({email:'demo@example.invalid'}),{status:200,headers:{'Content-Type':'application/json'}}));
  if(url.pathname.endsWith('/api/invitations'))return Promise.resolve(new Response(JSON.stringify({invitations:[]}),{status:200,headers:{'Content-Type':'application/json'}}));
  if(url.pathname.endsWith('/api/runtime'))return Promise.resolve(new Response(JSON.stringify({payments:{enabled:false,allowUnpaidPublishing:false}}),{status:200,headers:{'Content-Type':'application/json'}}));
  if(url.pathname.includes('/api/'))return Promise.resolve(new Response(JSON.stringify({error:'Демо: API отключён'}),{status:403,headers:{'Content-Type':'application/json'}}));
  return originalFetch(input,init);
 };
 document.addEventListener('submit',e=>{if(e.target.closest('form')){e.preventDefault();e.stopImmediatePropagation();alert('Демо: отправка данных отключена.')}},true);
})();
