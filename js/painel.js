/*
 * Gaya-Link — painel demonstrativo, executado inteiramente no navegador.
 * Não faz requisições, não transmite dados e não usa bibliotecas externas.
 * Fluxo: array de objetos -> filtros -> elementos DOM -> seleção -> simulação.
 */

// Regras didáticas de organização de visitas, não um modelo agronômico.
// A mesma entrada sempre produz a mesma saída. Os limites aparecem na página.
function classificarCenario(umidade, chuvaMm) {
  if (umidade < 30 && chuvaMm < 10) {
    return {
      codigo: "alta", titulo: "Prioridade alta", classe: "status-high", ordem: 1,
      motivo: "A umidade simulada está abaixo de 30% e a chuva simulada abaixo de 10 mm.",
      acao: "Colocar este talhão entre os primeiros da lista de vistoria e conferir as condições no local."
    };
  }
  if (umidade < 30 && chuvaMm >= 10) {
    return {
      codigo: "previsao", titulo: "Conferir previsão", classe: "status-watch", ordem: 3,
      motivo: "A umidade simulada está abaixo de 30% e a chuva simulada é de pelo menos 10 mm.",
      acao: "Conferir uma previsão oficial e observar o talhão antes de discutir qualquer intervenção."
    };
  }
  if (umidade <= 60) {
    return {
      codigo: "acompanhar", titulo: "Acompanhar", classe: "status-ok", ordem: 4,
      motivo: "A umidade simulada está entre 30% e 60%, incluindo os dois limites.",
      acao: "Manter a observação de rotina. Esta classificação não comprova que a cultura esteja saudável."
    };
  }
  return {
    codigo: "excesso", titulo: "Verificar excesso", classe: "status-wet", ordem: 2,
    motivo: "A umidade simulada está acima de 60%.",
    acao: "Incluir uma verificação de possível excesso de água na vistoria e conversar com assistência técnica."
  };
}

(function iniciarPainel() {
  "use strict";

  const lista = document.getElementById("painel-registros");
  if (!lista) return;

  const busca = document.getElementById("filtro-busca");
  const cultura = document.getElementById("filtro-cultura");
  const status = document.getElementById("filtro-status");
  const ordem = document.getElementById("filtro-ordem");
  const contagem = document.getElementById("painel-contagem");
  const vazio = document.getElementById("painel-vazio");
  const aviso = document.getElementById("painel-aviso");
  const formulario = document.getElementById("cenario-form");
  const umidade = document.getElementById("cenario-umidade");
  const chuva = document.getElementById("cenario-chuva");
  const resultado = document.getElementById("cenario-resultado");
  const mensagem = document.getElementById("cenario-mensagem");
  const mapa = document.getElementById("mapa-talhoes");
  const feed = document.getElementById("feed-eventos");
  let selecionado = talhoes[0];

  function normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }

  // Cria elementos sem interpretar texto do usuário como HTML.
  function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
  }

  // Histórico apenas das ações desta sessão, sem eventos automáticos inventados.
  function registrarEvento(texto) {
    if (!feed) return;
    feed.insertBefore(criarElemento("li", "", texto), feed.firstChild);
    while (feed.children.length > 5) feed.removeChild(feed.lastElementChild);
  }

  // O mapa representa sempre a base completa; os filtros atuam só na lista.
  function renderizarMapa() {
    if (!mapa) return;
    mapa.replaceChildren();
    talhoes.forEach(function (registro) {
      const situacao = classificarCenario(registro.umidade, registro.chuvaMm);
      const ativo = registro.id === selecionado.id;
      const botao = criarElemento("button", "legacy-plot " + situacao.classe + (ativo ? " is-selected" : ""));
      botao.type = "button";
      botao.setAttribute("aria-pressed", String(ativo));
      botao.setAttribute("aria-label", "Selecionar no mapa: " + registro.nome + ", " + situacao.titulo);
      botao.appendChild(criarElemento("strong", "", String(registro.id).padStart(2, "0")));
      botao.appendChild(criarElemento("span", "", registro.nome));
      botao.appendChild(criarElemento("small", "", situacao.titulo));
      botao.addEventListener("click", function () { carregarCenario(registro, true); });
      mapa.appendChild(botao);
    });
  }

  // Mostra o registro original, sem confundir valores da base com cenários editados.
  function atualizarMonitor() {
    const situacao = classificarCenario(selecionado.umidade, selecionado.chuvaMm);
    const valores = [
      ["monitor-nome", selecionado.nome],
      ["monitor-umidade", selecionado.umidade.toLocaleString("pt-BR") + "%"],
      ["monitor-chuva", selecionado.chuvaMm.toLocaleString("pt-BR") + " mm"],
      ["monitor-prioridade", situacao.titulo],
      ["monitor-cultura", selecionado.cultura]
    ];
    valores.forEach(function (par) {
      const elemento = document.getElementById(par[0]);
      if (elemento) elemento.textContent = par[1];
    });
  }

  function limparErro(campo) {
    campo.removeAttribute("aria-invalid");
    document.getElementById(campo.id + "-erro").textContent = "";
  }

  function invalidarResultado() {
    resultado.hidden = true;
    mensagem.textContent = "Os valores foram alterados. Acione Analisar cenário para atualizar o resultado.";
  }

  function carregarCenario(registro, moverFoco) {
    selecionado = registro;
    document.getElementById("cenario-titulo").textContent = "Cenário: " + registro.nome;
    document.getElementById("cenario-identificacao").textContent = registro.cultura + " · " + registro.municipio + " · " + registro.areaHa.toLocaleString("pt-BR") + " ha fictícios";
    umidade.value = registro.umidade;
    chuva.value = registro.chuvaMm;
    limparErro(umidade);
    limparErro(chuva);
    resultado.hidden = true;
    mensagem.textContent = "Registro carregado. Você pode ajustar os valores e analisar o cenário.";
    renderizarRegistros();
    renderizarMapa();
    atualizarMonitor();
    if (moverFoco) {
      registrarEvento("Talhão fictício selecionado: " + registro.nome + ". Valores originais carregados para explorar o cenário.");
      document.getElementById("cenario-titulo").focus();
    }
  }

  function renderizarRegistros() {
    const termo = normalizar(busca.value);
    let visiveis = talhoes.filter(function (registro) {
      const situacao = classificarCenario(registro.umidade, registro.chuvaMm);
      const correspondeBusca = normalizar(registro.nome + " " + registro.municipio + " " + registro.cultura).includes(termo);
      return correspondeBusca && (!cultura.value || registro.cultura === cultura.value) && (!status.value || situacao.codigo === status.value);
    });

    // Ordena uma cópia filtrada; o conjunto original permanece preservado.
    if (ordem.value === "prioridade") {
      visiveis.sort(function (a, b) {
        return classificarCenario(a.umidade, a.chuvaMm).ordem - classificarCenario(b.umidade, b.chuvaMm).ordem || a.id - b.id;
      });
    } else if (ordem.value === "nome") {
      visiveis.sort(function (a, b) { return a.nome.localeCompare(b.nome, "pt-BR"); });
    }

    lista.replaceChildren();
    visiveis.forEach(function (registro) {
      const situacao = classificarCenario(registro.umidade, registro.chuvaMm);
      const card = criarElemento("article", "record-card");
      card.setAttribute("aria-labelledby", "registro-titulo-" + registro.id);
      const titulo = criarElemento("h3", "", registro.nome);
      titulo.id = "registro-titulo-" + registro.id;
      card.appendChild(criarElemento("span", "badge " + situacao.classe, situacao.titulo));
      card.appendChild(titulo);
      card.appendChild(criarElemento("p", "helper", registro.cultura + " · " + registro.municipio));
      const dados = criarElemento("dl", "record-data");
      [["Área", registro.areaHa.toLocaleString("pt-BR") + " ha"], ["Umidade simulada", registro.umidade + "%"], ["Chuva simulada", registro.chuvaMm + " mm"]].forEach(function (par) {
        const item = criarElemento("div");
        item.appendChild(criarElemento("dt", "", par[0]));
        item.appendChild(criarElemento("dd", "", par[1]));
        dados.appendChild(item);
      });
      card.appendChild(dados);
      const botao = criarElemento("button", "button button-secondary", registro.id === selecionado.id ? "Cenário selecionado" : "Explorar cenário");
      botao.type = "button";
      botao.setAttribute("aria-label", "Explorar cenário de " + registro.nome);
      botao.setAttribute("aria-pressed", String(registro.id === selecionado.id));
      botao.addEventListener("click", function () { carregarCenario(registro, true); });
      card.appendChild(botao);
      lista.appendChild(card);
    });
    contagem.textContent = visiveis.length + " de " + talhoes.length + " talhões fictícios exibidos.";
    vazio.hidden = visiveis.length !== 0;
  }

  function validarNumero(campo, nome, unidade) {
    limparErro(campo);
    const texto = campo.value.trim();
    const numero = Number(texto);
    let erro = "";
    if (texto === "") erro = "Informe " + nome + ".";
    else if (!Number.isFinite(numero) || numero < 0 || numero > 100) erro = "Informe um número entre 0 e 100 " + unidade + ".";
    if (erro) {
      campo.setAttribute("aria-invalid", "true");
      document.getElementById(campo.id + "-erro").textContent = erro;
      return null;
    }
    return numero;
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const valorUmidade = validarNumero(umidade, "a umidade simulada", "%");
    const valorChuva = validarNumero(chuva, "a chuva simulada", "mm");
    if (valorUmidade === null || valorChuva === null) {
      resultado.hidden = true;
      mensagem.textContent = "Não foi possível analisar. Corrija os campos indicados.";
      (valorUmidade === null ? umidade : chuva).focus();
      return;
    }
    const situacao = classificarCenario(valorUmidade, valorChuva);
    const classificacao = document.getElementById("cenario-classificacao");
    classificacao.className = "badge " + situacao.classe;
    classificacao.textContent = situacao.titulo;
    document.getElementById("cenario-valores").textContent = selecionado.nome + ": " + valorUmidade.toLocaleString("pt-BR") + "% de umidade e " + valorChuva.toLocaleString("pt-BR") + " mm de chuva simuladas.";
    document.getElementById("cenario-motivo").textContent = situacao.motivo;
    document.getElementById("cenario-acao").textContent = situacao.acao;
    resultado.hidden = false;
    mensagem.textContent = "Cenário analisado: " + situacao.titulo + ". " + situacao.motivo;
    registrarEvento("Cenário analisado para " + selecionado.nome + ": " + valorUmidade.toLocaleString("pt-BR") + "% de umidade, " + valorChuva.toLocaleString("pt-BR") + " mm de chuva simuladas. Resultado: " + situacao.titulo + ".");
  });

  [umidade, chuva].forEach(function (campo) {
    campo.addEventListener("input", function () { limparErro(campo); invalidarResultado(); });
  });

  document.getElementById("cenario-restaurar").addEventListener("click", function () {
    carregarCenario(selecionado, false);
    mensagem.textContent = "Valores originais do registro restaurados. Acione Analisar cenário para calcular novamente.";
    registrarEvento("Valores originais do talhão fictício " + selecionado.nome + " restaurados.");
  });

  busca.addEventListener("input", renderizarRegistros);
  [cultura, status, ordem].forEach(function (campo) { campo.addEventListener("change", renderizarRegistros); });
  document.getElementById("filtros-limpar").addEventListener("click", function () {
    busca.value = "";
    cultura.value = "";
    status.value = "";
    ordem.value = "original";
    renderizarRegistros();
    aviso.textContent = "Filtros removidos. Os 12 registros originais estão visíveis.";
  });
  document.getElementById("painel-priorizar").addEventListener("click", function () {
    ordem.value = "prioridade";
    renderizarRegistros();
    aviso.textContent = "Lista ordenada por prioridade didática: prioridade alta, verificar excesso, conferir previsão e acompanhar. Os filtros atuais foram mantidos.";
  });

  document.getElementById("painel-total").textContent = talhoes.length;
  document.getElementById("painel-prioritarios").textContent = talhoes.filter(function (registro) { return classificarCenario(registro.umidade, registro.chuvaMm).codigo === "alta"; }).length;
  document.getElementById("painel-culturas").textContent = new Set(talhoes.map(function (registro) { return registro.cultura; })).size;
  if (feed) feed.replaceChildren();
  carregarCenario(selecionado, false);
  registrarEvento("Painel carregado com " + talhoes.length + " talhões fictícios. Registro inicial: " + selecionado.nome + ".");
})();
