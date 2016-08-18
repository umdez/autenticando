'use strict';

/*******************************************************************
 * Autenticando é de (C) propriedade da Devowly Sistemas 2015-2016 *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id indice.js, criado em 17/08/2016 às 19:46 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

var utilitario = require('util');
var EmissorDeEvento = require('events').EventEmitter;
var Promessa = require('bluebird');
var registrador = require('../nucleo/registrador')('autenticacao');
var controladores = require('./controladores/indice');

var Autenticacao = function (fonte) {
  this.fonte = fonte;

  EmissorDeEvento.call(this);
};

utilitario.inherits(Autenticacao, EmissorDeEvento);

Autenticacao.prototype.iniciar = function () {
  var esteObjeto = this;

  registrador.debug('Iniciando autenticacao.');

  return new Promessa(function (deliberar, recusar) {
    var ControladorDeAutenticacao = new controladores['Autenticacao']({
      'fonte': esteObjeto.fonte
    });

    var ControladorDeSessao = new controladores['Sessao']({
      'fonte': esteObjeto.fonte
    });

    var ControladorDeSaida = new controladores['Saida']({
      'fonte': esteObjeto.fonte
    });
    
    deliberar(esteObjeto);
  });
};

module.exports = Autenticacao;