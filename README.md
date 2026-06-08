<!--
  ============================================================
  Anotação minha sobre de onde veio o conteúdo de cada arquivo
  (fase / aula da imersão):

  - index.html ........ Fase 01 (Aulas 01, 02, 03, 05), Fase 02
                        (Aula 03), Fase 03 (Aulas 01, 02)
  - solucao.html ...... Fase 01 (Aulas 02, 06), Fase 02 (Aula 03),
                        Fase 03 (Aulas 03, 06, 07), Fase 04
                        (Aulas 03, 05)
  - painel.html ....... Fase 02 (Aulas 03, 10), Fase 04 (Aula 02)
                        + lógica no js/painel.js
  - mercado.html ...... Fase 02 (Aulas 04, 11), Fase 03 (Aula 05),
                        Fase 01 (Aula 08), Cap. 1 Mercado e Tec.
  - contato.html ...... Fase 02 (Aula 03), Fase 03 (Aula 08),
                        Fase 04 (Aula 02)
  - css/styles.css .... Fase 02 (Aula 03), Fase 03 (Aula 02),
                        Fase 04 (Aula 02)
  - js/main.js ........ Fase 02 (Aulas 09, 10), Fase 04 (Aulas
                        04, 07), Fase 01 (Aulas 06/07)
  - js/painel.js ...... Fase 01 (Aulas 06/07), Fase 02 (Aulas 03,
                        08, 10), Fase 04 (Aulas 04, 06, 07)
  - js/contato.js ..... Fase 02 (Aulas 09/10), Fase 03 (Aula 08),
                        Fase 04 (Aulas 04, 07), Fase 01 (Aulas
                        06/07)
  ============================================================
-->

# AetherAgri · Gaya-Link — Wolves Tech

Protótipo interativo desenvolvido para a **Global Solution 2026/1** (FIAP — 1º ano de
Engenharia de Software). O desafio propõe conectar a **exploração espacial** a problemas e
oportunidades reais na Terra. Nossa solução, o **Gaya-Link**, é um ecossistema *Space-Agri*
que funde dados de satélite, hardware IoT e inteligência artificial para tornar a agricultura
**proativa**.

> "Quando ideias ganham propósito, elas têm o poder de transformar realidades."

## A solução em 3 pilares
- **Orbital Sensing** — integração com os satélites LANDSAT 8/9 para imagens espectrais (NDVI).
- **Hybrid Edge** — hardware IoT que se comunica via satélite em zonas sem rede celular.
- **Aether-AI** — algoritmos que preveem surtos de pragas usando dados históricos da NASA.

## Páginas (5 telas navegáveis)
| Arquivo | Conteúdo |
|---|---|
| `index.html` | Página inicial: problema, solução e os 3 pilares. |
| `solucao.html` | Arquitetura técnica: integração NASA EarthData, app e performance (+47%). |
| `painel.html` | **Painel Orbital interativo** (simulação). |
| `mercado.html` | Mercado Space-Agri (US$ 15 Bi) e impacto ESG / ODS da ONU. |
| `contato.html` | Formulário de contato com a Wolves Tech (validação em JS). |

## Funcionalidades interativas (JavaScript)
- **Live Orbit Map** — satélite animado em Canvas 2D cruzando a fazenda e captando NDVI.
- **NDVI Heatmap** — grade de talhões clicável, com nova varredura gerada dinamicamente.
- **Climate Forecast** — previsão de 5 dias gerada por script.
- **Telemetria ao vivo** — valores que variam em tempo real.
- **Simulador de risco de praga (Aether-AI)** — calcula o risco a partir de cultura, umidade e temperatura.
- **Feed de alertas** — registro em tempo real com horário.
- **Formulário validado** — feedback de sucesso/erro sem back-end.

## Tecnologias (apenas conteúdo até a Fase 4)
- **HTML5**
- **CSS3** (com **Bootstrap 5** via CDN — Fase 4)
- **JavaScript** (vanilla, DOM, eventos, funções e Canvas 2D)

> Os dados exibidos são **simulados** para a prova de conceito (MVP).

## Como executar
Basta abrir o arquivo `index.html` em qualquer navegador moderno. Não há dependências locais
nem necessidade de servidor (apenas conexão à internet para Bootstrap e fontes via CDN).

## Identidade
**Wolves Tech** — *liderando a alcateia rumo às estrelas.*
Site: www.aetheragri.space · Social: @wolvestech

## Fontes de dados (referência)
- NASA — nasa.gov
- ESA — esa.int
- Space Charter — disasterscharter.org
