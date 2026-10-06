(function(){
  function addPreviewCta(){
    if(document.getElementById('preview-purchase-cta'))return;
    var root=document.getElementById('allrecords')||document.body;
    var section=document.createElement('section');
    section.id='preview-purchase-cta';
    section.setAttribute('aria-label','Создать приглашение');
    section.innerHTML='<div class="preview-purchase-cta__eyebrow">ПОНРАВИЛСЯ ЭТОТ ДИЗАЙН?</div><h2>Создайте своё приглашение</h2><p>Выберите шаблон, добавьте данные о событии и сохраните результат в личном кабинете.</p><a href="../webgencyinvitations.com/auth.html?mode=register">Создать такое приглашение</a>';
    root.appendChild(section);
    var style=document.createElement('style');
    style.textContent='#preview-purchase-cta{box-sizing:border-box;padding:72px 24px 78px;text-align:center;background:linear-gradient(145deg,#fff 0%,#fbf6ea 100%);border-top:1px solid rgba(169,129,63,.24);font-family:Arial,sans-serif}#preview-purchase-cta .preview-purchase-cta__eyebrow{margin-bottom:15px;color:#a9813f;font-size:13px;font-weight:700;letter-spacing:.14em}#preview-purchase-cta h2{max-width:680px;margin:0 auto 16px;color:#0d3b2e;font:700 38px/1.13 Georgia,serif}#preview-purchase-cta p{max-width:600px;margin:0 auto 28px;color:#565d5a;font-size:17px;line-height:1.55}#preview-purchase-cta a{display:inline-flex;box-sizing:border-box;align-items:center;justify-content:center;min-width:310px;height:58px;padding:0 28px;border-radius:999px;color:#fff;text-decoration:none;font-size:17px;font-weight:700;background:linear-gradient(110deg,#0d3b2e 0%,#1a6b52 36%,#b88a3d 52%,#1a6b52 70%,#0a5067 100%);background-size:280% 100%;box-shadow:0 12px 28px rgba(13,59,46,.2);animation:previewCtaShimmer 4.2s ease-in-out infinite}@keyframes previewCtaShimmer{0%,18%{background-position:100% 50%}55%,100%{background-position:0 50%}}@media(max-width:479px){#preview-purchase-cta{padding:54px 20px 60px}#preview-purchase-cta h2{font-size:30px}#preview-purchase-cta p{font-size:16px}#preview-purchase-cta a{width:100%;min-width:0;height:58px;padding:0 18px;font-size:16px}.tn-elem[data-elem-id="1763405219328"]{left:16px!important;width:calc(100% - 32px)!important}.tn-elem[data-elem-id="1763405219328"] .tn-atom{font-size:34px!important;line-height:1.15!important;white-space:normal!important}}@media(prefers-reduced-motion:reduce){#preview-purchase-cta a{animation:none}}';
    document.head.appendChild(style);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addPreviewCta);else addPreviewCta();
})();
