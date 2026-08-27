(function(){
  // mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // active nav link
  var here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.main-nav a').forEach(function(a){
    var href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  // scroll reveal
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function(el){ io.observe(el); });
  } else {
    items.forEach(function(el){ el.classList.add('is-visible'); });
  }

  // contact form (static demo — no backend)
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var status = document.getElementById('form-status');
      if (status) {
        status.textContent = 'Mulțumim! Acesta este un formular demonstrativ — mesajele nu sunt trimise încă către secretariat.';
      }
      form.reset();
    });
  }
})();
