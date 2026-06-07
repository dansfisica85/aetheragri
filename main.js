/* =========================================================
   main.js — comportamento compartilhado
   AetherAgri · Gaya-Link — Wolves Tech
   Vanilla JavaScript (conteúdo até a Fase 4)
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
