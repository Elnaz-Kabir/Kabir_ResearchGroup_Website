// Lightweight site interactions for Kabir Modern theme
(function(){
  'use strict';

  // Respect reduced motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth scroll for same-page anchors
  function smoothScrollInit(){
    if(reduceMotion) return;
    document.addEventListener('click', function(e){
      const a = e.target.closest('a[href^="#"]');
      if(!a) return;
      const hash = a.getAttribute('href');
      if(hash === '#' || hash === '') return;
      const target = document.querySelector(hash);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
        history.replaceState(null, '', hash);
      }
    });
  }

  // Scroll reveal using IntersectionObserver
  function scrollRevealInit(){
    if(reduceMotion) return;
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if(entry.isIntersecting){
          // If element is a listing grid, reveal children with stagger
          const el = entry.target;
          if(el.classList.contains('quarto-listing-grid')){
            const items = el.querySelectorAll('.listing-box, .quarto-listing-item, .card');
            items.forEach((it, i) => {
              it.style.transitionDelay = (i * 60) + 'ms';
              it.classList.add('reveal', 'is-visible');
            });
          } else {
            entry.target.classList.add('is-visible');
          }
          obs.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});

    // Observe both section-level reveals and listing grids
    document.querySelectorAll('.reveal, .quarto-listing-grid').forEach(el => obs.observe(el));
  }

  // Scroll-to-top button
  function scrollTopInit(){
    const btn = document.createElement('button');
    btn.className = 'scroll-top';
    btn.setAttribute('aria-label','Scroll to top');
    btn.innerHTML = '↑';
    Object.assign(btn.style, {
      position: 'fixed', right: '18px', bottom: '18px', zIndex: 80,
      width: '44px', height: '44px', borderRadius: '10px', border: 'none',
      background: 'linear-gradient(180deg, rgba(17,139,130,0.95), rgba(11,111,106,0.95))',
      color: 'white', boxShadow: '0 6px 18px rgba(7,16,40,0.12)', cursor: 'pointer', display: 'none',
      fontSize: '18px'
    });
    document.body.appendChild(btn);
    window.addEventListener('scroll', ()=>{
      if(window.scrollY > 420) btn.style.display = 'block'; else btn.style.display = 'none';
    });
    btn.addEventListener('click', ()=> window.scrollTo({top:0, behavior: reduceMotion? 'auto' : 'smooth'}));
  }

  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function(){
    try{ smoothScrollInit(); scrollRevealInit(); scrollTopInit(); }catch(e){console.error(e);}  
  });

})();
