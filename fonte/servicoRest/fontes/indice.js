'use strict';

/* @arquivo indice.js
 *
 * Realiza a leitura dos arquivos com extenção .js desta pasta, 
 * para depois, carregar as rotas REST para cada um deles.
 */

var sistemaDeArquivos = require('fs');
var pasta = require('path');

module.exports = function ()  {
  var fontes = [];

  // carrega pasta atual
  sistemaDeArquivos
    .readdirSync(__dirname)
    .filter(function (arquivo) {
      // carrega aqueles arquivos com extenção .js e filtra o arquivo indice.js
      return ((arquivo.indexOf('.') !== 0) && (arquivo !== 'indice.js') && (arquivo.slice(-3) === '.js'));
    })
    // carregamos os fontes
    .forEach(function (arquivo) {
      
      // removemos a extensão deste arquivo
      arquivo = arquivo.substr(0, arquivo.lastIndexOf('.'));
      
      // Carregamos a fonte.
      var fonte = require(pasta.join(__dirname, arquivo));
      
      // Adiciona a fonte a matriz.
      fontes.push(fonte);
    });

  return fontes;
};