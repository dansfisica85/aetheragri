/*
 * Gaya-Link — conjunto local para a prova de conceito CitizenTech.
 * Os 12 registros são fictícios. Não são medições de sensores nem previsões.
 * O array de objetos é percorrido em painel.js para construir os cards no DOM.
 * Uma base fixa permite repetir os mesmos testes e explicar cada resultado.
 */
const talhoes = [
  { id: 1, nome: "Horta do Ipê", cultura: "Hortaliças", municipio: "Ibiúna (SP)", areaHa: 0.8, umidade: 22, chuvaMm: 3 },
  { id: 2, nome: "Milharal da Serra", cultura: "Milho", municipio: "Piedade (SP)", areaHa: 2.4, umidade: 28, chuvaMm: 14 },
  { id: 3, nome: "Feijão da Várzea", cultura: "Feijão", municipio: "Capão Bonito (SP)", areaHa: 1.6, umidade: 46, chuvaMm: 8 },
  { id: 4, nome: "Horta da Nascente", cultura: "Hortaliças", municipio: "Ibiúna (SP)", areaHa: 0.6, umidade: 72, chuvaMm: 20 },
  { id: 5, nome: "Pomar do Sol", cultura: "Frutas", municipio: "São Miguel Arcanjo (SP)", areaHa: 1.2, umidade: 18, chuvaMm: 0 },
  { id: 6, nome: "Feijão do Horizonte", cultura: "Feijão", municipio: "Itapetininga (SP)", areaHa: 2.1, umidade: 54, chuvaMm: 6 },
  { id: 7, nome: "Milho do Cedro", cultura: "Milho", municipio: "Pilar do Sul (SP)", areaHa: 3.0, umidade: 25, chuvaMm: 12 },
  { id: 8, nome: "Pomar das Águas", cultura: "Frutas", municipio: "Piedade (SP)", areaHa: 1.5, umidade: 67, chuvaMm: 18 },
  { id: 9, nome: "Horta da Colina", cultura: "Hortaliças", municipio: "São Roque (SP)", areaHa: 0.9, umidade: 37, chuvaMm: 5 },
  { id: 10, nome: "Milho da Esperança", cultura: "Milho", municipio: "Capão Bonito (SP)", areaHa: 2.8, umidade: 21, chuvaMm: 2 },
  { id: 11, nome: "Feijão do Vale", cultura: "Feijão", municipio: "Itapetininga (SP)", areaHa: 1.8, umidade: 60, chuvaMm: 10 },
  { id: 12, nome: "Pomar da Araucária", cultura: "Frutas", municipio: "Pilar do Sul (SP)", areaHa: 1.1, umidade: 30, chuvaMm: 9 }
];
