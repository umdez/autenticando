'use strict';

var Base = require('../indice');

function CarregaAutenticacao(configuracao, aplicativo) {

  this.opcoes = {
    configuracao: configuracao || {}
  , aplicativo: aplicativo
  };

};

CarregaAutenticacao.prototype.carregar = function (modulos) {

  this.opcoes.modulos = modulos;
  
  var autenticacao = new Base.Autenticacao(this.opcoes);

  return autenticacao.iniciar();
};

module.exports = CarregaAutenticacao;