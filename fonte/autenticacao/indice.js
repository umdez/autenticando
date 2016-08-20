'use strict';

var utilitario = require('util');
var EmissorDeEvento = require('events').EventEmitter;
var Promessa = require('bluebird');
var registrador = require('../nucleo/registrador')('autenticacao');
var controladores = require('./controladores/indice');

var Autenticacao = function (opcoes) {

  EmissorDeEvento.call(this);

  if (!opcoes) {
    throw new Error('As opções de configuração da autenticação não foram informadas.');
  }

  this.configuracao = opcoes.configuracao;

  //_.defaults(this.configuracao, { });

  this.aplicativo = opcoes.aplicativo;

  this.modulos = opcoes.modulos;

  this.controladores = [];
};

utilitario.inherits(Autenticacao, EmissorDeEvento);

Autenticacao.prototype.iniciar = function () {
  var meuObj = this;
  var moduloRest = this.modulos['rest'];
  var contas = moduloRest.fontes['Contas'].fonte;
  var modelos = this.modulos['bd'].modelos;

  registrador.debug('Iniciando autenticacao.');

  return new Promessa(function (deliberar, recusar) {

    controladores.forEach(function (c) {
      meuObj.controladores[c.nome] = new c.Controlador({ 'fonte': contas, modelos: modelos });
    });
    
    deliberar(meuObj);
  });
};

module.exports = Autenticacao;