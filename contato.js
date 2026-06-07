/* =========================================================
   contato.js — validação do formulário de contato
   AetherAgri · Gaya-Link — Wolves Tech
   Vanilla JavaScript (conteúdo até a Fase 4)
   ========================================================= */
(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  var result = document.getElementById('contactResult');
  if (!form) return;

  function isEmail(value) {
    // Validação simples de e-mail
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nome = document.getElementById('nome');
    var email = document.getElementById('email');
    var msg = document.getElementById('msg');
    var ok = true;

    // Limpa estados anteriores
    [nome, email, msg].forEach(function (f) { f.classList.remove('is-invalid'); });

    if (!nome.value || nome.value.trim().length < 3) { nome.classList.add('is-invalid'); ok = false; }
    if (!email.value || !isEmail(email.value)) { email.classList.add('is-invalid'); ok = false; }
    if (!msg.value || msg.value.trim().length < 10) { msg.classList.add('is-invalid'); ok = false; }

    if (!ok) {
      result.innerHTML = '<div class="alert-line"><span class="tag tag-crit">ERRO</span>' +
        '<span>Revise os campos destacados e tente novamente.</span></div>';
      return;
    }

    // "Envio" simulado (protótipo — sem back-end)
    var primeiroNome = nome.value.trim().split(' ')[0];
    result.innerHTML =
      '<div class="panel-card" style="padding:1rem;background:linear-gradient(135deg,rgba(46,230,125,.12),transparent)">' +
        '<div class="d-flex align-items-center gap-2 mb-1">' +
          '<i class="bi bi-check-circle-fill text-green"></i>' +
          '<strong>Mensagem enviada, ' + primeiroNome + '!</strong>' +
        '</div>' +
        '<p class="text-muted-soft small mb-0">A equipe da Wolves Tech entrará em contato pelo e-mail ' +
          '<span class="text-green">' + email.value.trim() + '</span> para agendar a demonstração do Gaya-Link.</p>' +
      '</div>';

    form.reset();
  });
})();
