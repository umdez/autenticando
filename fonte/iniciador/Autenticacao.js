'use strict';

/*******************************************************************
 * Autenticando é de (C) propriedade da Devowly Sistemas 2015-2016 *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id Autenticacao.js, criado em 17/08/2016 às 19:42 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

var Base = require('../indice');

function CarregaAutenticacao() {};

CarregaAutenticacao.prototype.carregar = function (servicoRest, armazenamento) {

  var autenticacao = new Base.Autenticacao(servicoRest['Contas'], armazenamento['Usuarios']);

  return autenticacao.iniciar();
};

module.exports = CarregaAutenticacao;