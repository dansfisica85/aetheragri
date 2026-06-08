/* =========================================================
   painel.js — o cérebro do Painel Orbital (a simulação)

   Esse é o arquivo que eu mais me orgulho. É onde a Global
   Solution pede "simulação visual/interativa" e eu fui pra cima.
   Tudo aqui é dado fingido (mockado) pra provar o conceito.

   De onde veio cada coisa (pra eu lembrar depois):
   - Desenhar o satélite e a órbita na tag <canvas>: parte de
     HTML5 da Fase 02 - Aula 03 + a integração front+JS da
     Fase 02 - Aula 10 "JavaScript com HTML 5".
   - Toda a lógica (laços pra montar a grade NDVI, condições pro
     risco de praga, sortear valores): lógica e algoritmos da
     Fase 01 - Aula 06 "algoritmos e fluxograma" e Aula 07
     "Conceitos avançados de algoritmos", reforçada na
     Fase 04 - Aula 07 "Lógica para programar".
   - Funções separadas (drawFarm, pushAlert, jitter...):
     Fase 04 - Aula 04 "JavaScript e suas funções".
   - O cálculo do risco de praga usa matemática simples (média
     ponderada), que vi na Fase 02 - Aula 08 "Matemática para
     TI" e Fase 04 - Aula 06 "Matemática para tudo".
   - A ideia de NDVI/satélite/clima saiu do tema da Global
     Solution e da Fase 01 - Aula 08 "Infraestrutura
     Sustentável".
   ========================================================= */
(function () {
  'use strict';

  /* =====================================================
     1) LIVE ORBIT MAP — satélite cruzando a fazenda (Canvas)
     ===================================================== */
  var canvas = document.getElementById('orbitCanvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var W = canvas.width;
    var H = canvas.height;
    var t = 0;
    var passEl = document.getElementById('passStatus');

    // Pequenas estrelas de fundo
    var stars = [];
    for (var i = 0; i < 60; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + 0.2 });
    }

    function drawFarm() {
      // "Fazenda" no solo: faixa inferior com talhões
      var groundY = H - 70;
      ctx.fillStyle = 'rgba(20,40,28,0.9)';
      ctx.fillRect(0, groundY, W, 70);
      ctx.strokeStyle = 'rgba(46,230,125,0.25)';
      ctx.lineWidth = 1;
      for (var x = 40; x < W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x - 18, H);
        ctx.stroke();
      }
      // marcador da fazenda
      var fx = W * 0.5;
      ctx.fillStyle = '#2EE67D';
      ctx.beginPath();
      ctx.arc(fx, groundY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(244,248,244,0.8)';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Fazenda Aurora', fx + 10, groundY - 4);
      return { fx: fx, fy: groundY };
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);

      // estrelas
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      stars.forEach(function (s) {
        ctx.globalAlpha = 0.4 + Math.abs(Math.sin((t + s.x) * 0.02)) * 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      var farm = drawFarm();

      // trajetória orbital (arco)
      ctx.strokeStyle = 'rgba(46,230,125,0.35)';
      ctx.setLineDash([6, 8]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (var px = 0; px <= W; px += 8) {
        var py = 70 + Math.sin((px / W) * Math.PI) * -40 + 60;
        if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // posição do satélite ao longo da trajetória
      var prog = (t % 360) / 360; // 0..1
      var sx = prog * W;
      var sy = 70 + Math.sin(prog * Math.PI) * -40 + 60;

      // feixe de varredura quando próximo da fazenda
      var near = Math.abs(sx - farm.fx) < 120;
      if (near) {
        var grad = ctx.createLinearGradient(sx, sy, farm.fx, farm.fy);
        grad.addColorStop(0, 'rgba(46,230,125,0.45)');
        grad.addColorStop(1, 'rgba(46,230,125,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(farm.fx - 30, farm.fy);
        ctx.lineTo(farm.fx + 30, farm.fy);
        ctx.closePath();
        ctx.fill();
      }

      // satélite
      ctx.save();
      ctx.translate(sx, sy);
      ctx.fillStyle = '#2EE67D';
      ctx.shadowColor = '#2EE67D';
      ctx.shadowBlur = 12;
      ctx.fillRect(-6, -6, 12, 12);
      ctx.shadowBlur = 0;
      // "painéis solares"
      ctx.fillStyle = 'rgba(46,230,125,0.5)';
      ctx.fillRect(-16, -3, 8, 6);
      ctx.fillRect(8, -3, 8, 6);
      ctx.restore();

      // status da passagem
      if (passEl) {
        if (near) {
          passEl.textContent = 'Passagem AGORA · capturando NDVI';
          passEl.style.color = '#2EE67D';
        } else {
          var minutos = Math.round((1 - prog) * 16);
          passEl.textContent = 'Próxima passagem: ~' + minutos + ' min';
          passEl.style.color = '';
        }
      }

      t += 0.6;
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* =====================================================
     2) NDVI HEATMAP — grade de talhões clicável
     ===================================================== */
  var grid = document.getElementById('ndviGrid');
  var ndviInfo = document.getElementById('ndviInfo');
  var COLS = 8, ROWS = 5;

  function ndviColor(v) {
    // v: 0..1  → vermelho (seco) → verde (saudável)
    if (v < 0.3) return '#7a2e1e';
    if (v < 0.5) return '#b5882b';
    if (v < 0.7) return '#9bbf3a';
    return '#2EE67D';
  }

  function buildNdvi() {
    if (!grid) return;
    grid.innerHTML = '';
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var v = Math.round((0.25 + Math.random() * 0.7) * 100) / 100;
        if (v > 1) v = 1;
        var cell = document.createElement('div');
        cell.className = 'ndvi-cell';
        cell.style.background = ndviColor(v);
        cell.setAttribute('data-ndvi', v);
        cell.setAttribute('data-id', 'T-' + (r * COLS + c + 1));
        cell.addEventListener('click', function () {
          var prev = grid.querySelector('.ndvi-cell.active');
          if (prev) prev.classList.remove('active');
          this.classList.add('active');
          var nv = parseFloat(this.getAttribute('data-ndvi'));
          var status = nv >= 0.7 ? 'saudável 🌱' : nv >= 0.5 ? 'atenção ⚠️' : 'estresse 🔴';
          ndviInfo.innerHTML = 'Talhão <strong>' + this.getAttribute('data-id') +
            '</strong> · NDVI <span class="text-green">' + nv.toFixed(2) + '</span> · ' + status;
        });
        grid.appendChild(cell);
      }
    }
  }
  buildNdvi();

  var scanBtn = document.getElementById('scanBtn');
  if (scanBtn) {
    scanBtn.addEventListener('click', function () {
      buildNdvi();
      if (ndviInfo) ndviInfo.textContent = 'Nova varredura recebida do LANDSAT-9.';
      pushAlert('ok', 'Varredura NDVI concluída — ' + (COLS * ROWS) + ' talhões atualizados.');
    });
  }

  /* =====================================================
     3) CLIMATE FORECAST — previsão de 5 dias
     ===================================================== */
  var forecastEl = document.getElementById('forecast');
  if (forecastEl) {
    var dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
    var icons = ['bi-sun', 'bi-cloud-sun', 'bi-cloud', 'bi-cloud-drizzle', 'bi-cloud-rain'];
    dias.forEach(function (d) {
      var temp = 24 + Math.floor(Math.random() * 12);
      var ic = icons[Math.floor(Math.random() * icons.length)];
      var col = document.createElement('div');
      col.className = 'col';
      col.innerHTML =
        '<div class="forecast-day">' +
          '<div class="text-muted-soft small">' + d + '</div>' +
          '<div class="ico text-green"><i class="bi ' + ic + '"></i></div>' +
          '<div class="t">' + temp + '°</div>' +
        '</div>';
      forecastEl.appendChild(col);
    });
  }

  /* =====================================================
     4) TELEMETRIA — pequenas variações em tempo real
     ===================================================== */
  function jitter(id, base, range, suffix) {
    var el = document.getElementById(id);
    if (!el) return;
    setInterval(function () {
      var v = base + (Math.random() * range - range / 2);
      el.textContent = (suffix === '°C' || suffix === '%' || suffix === ' km/h')
        ? Math.round(v) + suffix
        : v.toFixed(2);
    }, 2500);
  }
  jitter('tTemp', 33, 4, '°C');
  jitter('tSoil', 58, 8, '%');
  jitter('tAir', 61, 10, '%');
  jitter('tWind', 12, 6, ' km/h');
  jitter('tNdvi', 0.71, 0.06, '');

  /* =====================================================
     5) SIMULADOR DE RISCO DE PRAGA (Aether-AI)
     ===================================================== */
  var riskForm = document.getElementById('riskForm');
  var umid = document.getElementById('umid');
  var temp = document.getElementById('temp');
  var umidVal = document.getElementById('umidVal');
  var tempVal = document.getElementById('tempVal');
  var riskResult = document.getElementById('riskResult');

  if (umid && umidVal) umid.addEventListener('input', function () { umidVal.textContent = umid.value + '%'; });
  if (temp && tempVal) temp.addEventListener('input', function () { tempVal.textContent = temp.value + '°C'; });

  if (riskForm) {
    riskForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var fator = parseFloat(document.getElementById('cultura').value) || 1;
      var u = parseInt(umid.value, 10);
      var tp = parseInt(temp.value, 10);

      // Modelo simples: pragas proliferam com calor + umidade altos
      var score = (u * 0.6 + (tp > 35 ? 30 : tp) * 1.2) * fator;
      var pct = Math.max(5, Math.min(99, Math.round(score / 1.8)));

      var nivel, classe, tag;
      if (pct < 40) { nivel = 'BAIXO'; classe = 'tag-ok'; tag = 'ok'; }
      else if (pct < 70) { nivel = 'MODERADO'; classe = 'tag-warn'; tag = 'warn'; }
      else { nivel = 'ALTO'; classe = 'tag-crit'; tag = 'crit'; }

      riskResult.innerHTML =
        '<div class="panel-card" style="padding:1rem">' +
          '<div class="d-flex justify-content-between align-items-center mb-2">' +
            '<span class="panel-title mb-0">Risco previsto</span>' +
            '<span class="tag ' + classe + '">' + nivel + '</span>' +
          '</div>' +
          '<div class="perf-track"><div class="perf-fill" style="width:' + pct + '%"></div></div>' +
          '<div class="text-end mt-1 text-green" style="font-family:\'JetBrains Mono\',monospace">' + pct + '%</div>' +
          '<p class="text-muted-soft small mb-0 mt-2">' + recomendacao(nivel) + '</p>' +
        '</div>';

      pushAlert(tag, 'Aether-AI: risco de praga ' + nivel + ' (' + pct + '%) calculado.');
    });
  }

  function recomendacao(nivel) {
    if (nivel === 'ALTO') return 'Recomendação: inspeção em campo em 24h e aplicação localizada de defensivo biológico.';
    if (nivel === 'MODERADO') return 'Recomendação: monitorar talhões de menor NDVI e reavaliar em 72h.';
    return 'Condições desfavoráveis à proliferação. Manter monitoramento padrão.';
  }

  /* =====================================================
     6) FEED DE ALERTAS — registro em tempo real
     ===================================================== */
  var feed = document.getElementById('alertFeed');

  function nowStr() {
    var d = new Date();
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
  }

  function pushAlert(tag, text) {
    if (!feed) return;
    var labels = { ok: 'OK', warn: 'ALERTA', crit: 'CRÍTICO' };
    var classes = { ok: 'tag-ok', warn: 'tag-warn', crit: 'tag-crit' };
    var line = document.createElement('div');
    line.className = 'alert-line';
    line.innerHTML =
      '<span class="tag ' + (classes[tag] || 'tag-ok') + '">' + (labels[tag] || 'OK') + '</span>' +
      '<span class="flex-grow-1">' + text + '</span>' +
      '<span class="time">' + nowStr() + '</span>';
    feed.insertBefore(line, feed.firstChild);
    // limita a 12 itens
    while (feed.children.length > 12) feed.removeChild(feed.lastChild);
  }

  // Alertas iniciais + simulação periódica vinda do satélite
  if (feed) {
    pushAlert('ok', 'Conexão estabelecida com LANDSAT-9 via NASA EarthData.');
    pushAlert('ok', 'NDVI médio da Fazenda Aurora: 0.71 (cultura saudável).');

    var amostras = [
      ['warn', 'Umidade do solo do talhão B-04 abaixo do ideal.'],
      ['ok', 'Telemetria IoT recebida: 100% dos sensores online.'],
      ['warn', 'Janela de chuva detectada para Qui — ajustar irrigação.'],
      ['crit', 'Queda de NDVI no talhão T-12: possível foco de praga.'],
      ['ok', 'Previsão climática hiperlocal atualizada via satélite.']
    ];
    setInterval(function () {
      var a = amostras[Math.floor(Math.random() * amostras.length)];
      pushAlert(a[0], a[1]);
    }, 6000);
  }
})();
