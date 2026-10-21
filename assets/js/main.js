/* Shared interactions: accessible product dropdown, FAQ accordion and scroll animations */
(function(){'use strict';
  var header=document.getElementById('site-header');
  var toggle=document.getElementById('nav-toggle');
  var nav=document.getElementById('main-nav');
  var dropdowns=document.querySelectorAll('.main-header .nav-dropdown');
  function closeDropdowns(except){dropdowns.forEach(function(d){if(d!==except){d.classList.remove('open');var a=d.querySelector('.dropdown-toggle');if(a)a.setAttribute('aria-expanded','false');}});}
  dropdowns.forEach(function(d){var a=d.querySelector('.dropdown-toggle');if(!a)return;a.addEventListener('click',function(e){if(window.matchMedia('(max-width: 768px)').matches){e.preventDefault();var open=!d.classList.contains('open');closeDropdowns(d);d.classList.toggle('open',open);a.setAttribute('aria-expanded',String(open));}});});
  document.addEventListener('click',function(e){if(!e.target.closest('.main-header'))closeDropdowns(null);});
  if(toggle&&nav){toggle.addEventListener('click',function(){var open=!nav.classList.contains('open');nav.classList.toggle('open',open);toggle.classList.toggle('active',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Tutup menu':'Buka menu');if(!open)closeDropdowns(null);});}
  document.querySelectorAll('.faq-item .faq-question').forEach(function(btn){btn.setAttribute('aria-expanded','false');var answer=btn.parentElement.querySelector('.faq-answer');if(answer){if(!answer.id)answer.id='faq-answer-'+Math.random().toString(36).slice(2,9);btn.setAttribute('aria-controls',answer.id);}btn.addEventListener('click',function(){var item=btn.closest('.faq-item');var isOpen=item.classList.contains('active');item.classList.toggle('active',!isOpen);btn.setAttribute('aria-expanded',String(!isOpen));if(answer){answer.style.maxHeight=!isOpen?answer.scrollHeight+'px':'0px';}});});
  var revealEls=document.querySelectorAll('.reveal');revealEls.forEach(function(el){if(el.classList.contains('portfolio-card')){var cards=Array.prototype.slice.call(document.querySelectorAll('.portfolio-card'));el.style.setProperty('--reveal-delay',Math.min(cards.indexOf(el)%3,2)*110+'ms');}});if('IntersectionObserver'in window){var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.08,rootMargin:'0px 0px -20px 0px'});revealEls.forEach(function(el){observer.observe(el);});}else revealEls.forEach(function(el){el.classList.add('visible');});
  window.addEventListener('resize',function(){document.querySelectorAll('.faq-item.active .faq-answer').forEach(function(el){el.style.maxHeight=el.scrollHeight+'px';});if(window.innerWidth>768&&nav){nav.classList.remove('open');if(toggle)toggle.setAttribute('aria-expanded','false');}});
})();

/* Keunggulan: gambar berganti saat card di-scroll, di-klik, atau di-hover */
(function(){'use strict';
  var img=document.getElementById('advantageImage');
  var cards=Array.prototype.slice.call(document.querySelectorAll('.adv-card[data-image]'));
  if(!img||!cards.length)return;
  cards.forEach(function(c){var p=new Image();p.src=c.getAttribute('data-image');});
  var current=cards.filter(function(c){return c.classList.contains('active');})[0]||cards[0];
  function activate(card){
    if(!card||card===current)return;
    current=card;
    cards.forEach(function(c){c.classList.toggle('active',c===card);});
    var src=card.getAttribute('data-image');
    img.style.opacity='0';img.style.transform='scale(.98)';
    setTimeout(function(){img.src=src;img.style.opacity='1';img.style.transform='scale(1)';},200);
  }
  cards.forEach(function(c){
    c.addEventListener('click',function(){activate(c);});
    c.addEventListener('mouseenter',function(){activate(c);});
    c.setAttribute('tabindex','0');
    c.addEventListener('focus',function(){activate(c);});
  });
  var ticking=false;
  function onScroll(){
    if(ticking)return;ticking=true;
    requestAnimationFrame(function(){
      ticking=false;
      var list=cards[0].parentElement.getBoundingClientRect();
      var vh=window.innerHeight;
      if(list.bottom<0||list.top>vh)return;
      var mid=vh*0.5,best=null,bestD=Infinity;
      cards.forEach(function(c){var r=c.getBoundingClientRect();var d=Math.abs((r.top+r.height/2)-mid);if(d<bestD){bestD=d;best=c;}});
      activate(best);
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
})();
