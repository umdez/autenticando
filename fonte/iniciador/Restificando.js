'use strict';

var Base = require('../indice');

function CarregaRestificando(configuracao, aplicativo) {

  this.opcoes = {
    configuracao: configuracao
  , aplicativo: aplicativo
  };
  
};

CarregaRestificando.prototype.carregar = function (modulos) {

  this.opcoes.modulos = modulos;

  var restificando = new Base.Restificando(this.opcoes);

  return restificando.iniciar();

};

module.exports = CarregaRestificando;