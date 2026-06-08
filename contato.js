/* =========================================================
   contato.js — validação do formulário de contato

   Esse arquivo cuida pra ninguém mandar o formulário vazio ou
   com e-mail furado. É a primeira vez que eu uso JS pra validar
   algo "de verdade" e achei massa.

   De onde veio cada coisa:
   - Pegar os campos do form e ouvir o submit: JavaScript +
     HTML da Fase 02 - Aula 09/10 (primeiros passos com JS e
     integração com HTML 5).
   - As condições (if) pra checar nome, e-mail e mensagem:
     lógica de programação da Fase 01 - Aula 06/07 e
     Fase 04 - Aula 07 "Lógica para programar".
   - Organizar tudo em funções (isEmail, etc.):
     Fase 04 - Aula 04 "JavaScript e suas funções".
   - O texto da mensagem de sucesso (falar bem com o cliente)
     puxa da Fase 03 - Aula 08 "Comunicação Empresarial".
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
