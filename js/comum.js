/* Recursos compartilhados. Sem envio de dados nem dependências externas. */
(function () {
  "use strict";
  const contraste = document.getElementById("contraste");
  const fonte = document.getElementById("fonte");
  // Cada página mantém os controles disponíveis mesmo se o armazenamento for bloqueado.
  function lerPreferencia(chave) {
    try { return localStorage.getItem(chave) === "true"; } catch (erro) { return false; }
  }
  function aplicar(botao, classe, chave, ativo) {
    document.documentElement.classList.toggle(classe, ativo);
    botao.setAttribute("aria-pressed", String(ativo));
    try { localStorage.setItem(chave, String(ativo)); } catch (erro) { /* Uso local continua. */ }
  }
  [[contraste,"alto-contraste","gaya-contraste"],[fonte,"texto-maior","gaya-fonte"]].forEach(function (item) {
    aplicar(item[0], item[1], item[2], lerPreferencia(item[2]));
    item[0].addEventListener("click", function () { aplicar(item[0], item[1], item[2], item[0].getAttribute("aria-pressed") !== "true"); });
  });

  const form = document.getElementById("contato-form");
  if (!form) return;
  const campos = ["nome","email","perfil","mensagem"];
  const status = document.getElementById("contato-status");
  campos.forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
      document.getElementById(id + "-erro").textContent = "";
      this.removeAttribute("aria-invalid");
      status.textContent = "Preenchimento alterado. Valide novamente quando terminar.";
      status.classList.remove("form-success");
    });
  });
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const erros = {};
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();
    if (nome.length < 3 || nome.length > 100) erros.nome = "Informe um nome com 3 a 100 caracteres.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) erros.email = "Informe um e-mail completo, como pessoa@exemplo.com.";
    if (!document.getElementById("perfil").value) erros.perfil = "Selecione a opção que descreve sua relação com o campo.";
    if (mensagem.length < 15 || mensagem.length > 1000) erros.mensagem = "Descreva sua ideia usando de 15 a 1.000 caracteres.";
    campos.forEach(function (id) {
      document.getElementById(id + "-erro").textContent = erros[id] || "";
      document.getElementById(id).setAttribute("aria-invalid", erros[id] ? "true" : "false");
    });
    const invalidos = campos.filter(function (id) { return erros[id]; });
    status.classList.remove("form-success");
    if (invalidos.length) {
      status.textContent = "Revise " + invalidos.length + " campo(s) indicado(s). Nenhum dado foi enviado.";
      document.getElementById(invalidos[0]).focus();
      return;
    }
    // textContent impede que dados digitados sejam interpretados como código HTML.
    status.textContent = nome + ", preenchimento validado com sucesso. Esta é uma simulação: nada foi enviado ou salvo.";
    status.classList.add("form-success");
  });
}());
