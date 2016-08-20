'use strict';

var Base = require('../indice');

function CarregaArmazenamento(configuracao, aplicativo) {
  this.opcoes = {
    configuracao: configuracao
  , aplicativo: aplicativo
  };
};

CarregaArmazenamento.prototype.carregar = function (modulos) {

  this.opcoes.modulos = modulos;

  var armazenamento = new Base.Armazenamento(this.opcoes);

  return armazenamento.iniciar();
};

module.exports = CarregaArmazenamento;