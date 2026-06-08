/* =========================================================
   main.js — o JavaScript que roda em todas as páginas

   Esse arquivo é o "basiquão" que dá vida ao site inteiro.
   Anotando de onde eu tirei cada parte, pra não esquecer:

   - Mexer no DOM, pegar elementos e ouvir eventos (clique,
     scroll): isso é a base de JavaScript que vi na
     Fase 02 - Aula 09 "Primeiros passos com o JavaScript" e na
     Fase 02 - Aula 10 "Utilizando o front integrando o
     JavaScript com HTML 5".
   - Funções organizadas e reutilizáveis (esse jeito de separar
     em funções): Fase 04 - Aula 04 "JavaScript e suas funções".
   - A lógica dos laços/condições (forEach, if): lógica de
     programação das Fase 01 - Aula 06/07 e Fase 04 - Aula 07
     "Lógica para programar".
   - Fechar o menu no mobile tem a ver com a parte responsiva /
     Bootstrap da Fase 04 - Aula 02.
   ========================================================= */
(function () {
  'use strict';

  /* ---- 1. Revelar elementos ao rolar a página ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: mostra tudo
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- 2. Animação das barras de performance ---- */
  var perfBlock = document.querySelector('[data-perf]');
  if (perfBlock) {
    var animatePerf = function () {
      var fills = perfBlock.querySelectorAll('.perf-fill');
      fills.forEach(function (fill) {
        var target = parseInt(fill.getAttribute('data-target'), 10) || 0;
        fill.style.width = target + '%';
      });
    };
    if ('IntersectionObserver' in window) {
      var pObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { animatePerf(); pObs.disconnect(); }
        });
      }, { threshold: 0.4 });
      pObs.observe(perfBlock);
    } else {
      animatePerf();
    }
  }

  /* ---- 3. Fecha o menu mobile ao clicar num link ---- */
  var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var collapse = document.querySelector('.navbar-collapse.show');
      if (collapse) {
        var toggler = document.querySelector('.navbar-toggler');
        if (toggler) { toggler.click(); }
      }
    });
  });
})();
