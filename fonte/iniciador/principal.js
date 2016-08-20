'use strict';

var registrador = require('../nucleo/registrador')('principal'); 
var Armazenamento = require('./Armazenamento');                 
var Restificando = require('./Restificando');                    
var Autenticacao = require('./Autenticacao');                     

exports.prosseguir = function(configuracao, aplicativo, pronto) {
 
  var modulos = [];

  var bd = modulos['bd'] = {
    'armazenamento': new Armazenamento(configuracao.armazenamento, aplicativo),
    'modelos': null,
    'sequelize': null
  };
 
  var rest = modulos['rest'] = {
    'restificando': new Restificando(configuracao.restificando, aplicativo),
    'fontes': null,
    'controladores': null
  };
  
  var aut = modulos['aut'] = {
    'autenticacao': new Autenticacao(configuracao.autenticacao, aplicativo),
    'controladores': null
  };

  var armazenamento = bd.armazenamento;
  var restificando = rest.restificando;
  var autenticacao = aut.autenticacao;

  registrador.debug('Carregando os módulos base do nosso servidor.');
  
  armazenamento.carregar(modulos).then(function (armazenamento) { 

  })
  .then(function () {
    return restificando.carregar(modulos);
  })
  .then(function (restificando) {
    return autenticacao.carregar(modulos);
  })
  .then(function (autenticacao) {
    pronto();
  })
  .catch(function (erro) {
    registrador.error(erro);
  });

}