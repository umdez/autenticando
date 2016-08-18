'use strict';

/*******************************************************************
 * Listificando é de (C) propriedade da Devowly Sistemas 2015-2016 *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id principal.js, criado em 18/07/2016 às 15:22 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

var registrador = require('../nucleo/registrador')('principal'); // O nosso registrador
var Armazenamento = require('./Armazenamento');                  // Modulo de armazenamento.
var ServicoRest = require('./ServicoRest');                      // O nosso serviço REST para cada um dos modelos de armazenamento.
var Autenticacao = require('./Autenticacao');                     

/* @Função prosseguir().
 *
 * Realiza o inicio dos nossos serviços principais.
 * 
 * @Parametro {Objeto} [configuracao] Contêm as informações de configuração.
 * @Parametro {Objeto} [aplicativo] O nosso aplicativo do servidor Express.
 * @Parametro {Função} [pronto] Será chamada ao realizarmos todas as nossas funções.
 ---------------------------------------------------------------------------------------*/
exports.prosseguir = function(configuracao, aplicativo, pronto) {
  var modulos = {};
  var armazenamento = new Armazenamento(configuracao);
  var servicoRest = new ServicoRest();
  var autenticacao = new Autenticacao();
  var aplic = aplicativo;
  var conf = configuracao;

  registrador.debug('Carregando os módulos base do nosso servidor.');
  
  armazenamento.carregar(configuracao)
  .then(function (objArm) {
    modulos.armazenamento = objArm;
  })
  .then(function () {
    return servicoRest.carregar(aplic, modulos.armazenamento, conf);
  })
  .then(function (objRest) {
    modulos.servicoRest = objRest;
  })
  .then(function () {
    return autenticacao.carregar(modulos.servicoRest, modulos.armazenamento);
  })
  .then(function () {
    pronto();
  })
  .catch(function (err) {
    registrador.error(err);
  });
 
}