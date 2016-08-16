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

/* @Função prosseguir().
 *
 * Realiza o inicio dos nossos serviços principais.
 * 
 * @Parametro {Objeto} [configuracao] Contêm as informações de configuração.
 * @Parametro {Objeto} [aplicativo] O nosso aplicativo do servidor Express.
 * @Parametro {Função} [pronto] Será chamada ao realizarmos todas as nossas funções.
 ---------------------------------------------------------------------------------------*/
exports.prosseguir = function(configuracao, aplicativo, pronto) {
  var esteObjeto = {};
  
  esteObjeto.armazenamento = new Armazenamento(configuracao);
  esteObjeto.servicoRest = new ServicoRest();
  
  registrador.debug('Carregando os módulos da base do nosso servidor.');
  
  esteObjeto.armazenamento.carregar(configuracao)
  .then(function (arm) {
    // Foi carregado os módulos de armazenamento
    esteObjeto.arm = arm;  
  })
  .then(function () {
    // Para cada modelo de tabela nós carregamos as rotas RESTFUL.
    return esteObjeto.servicoRest.carregar(aplicativo, esteObjeto.arm, configuracao);
  })
  .then(function () {
    // parece que tudo ocorreu bem
    pronto();
  })
  .catch(function (err) {
    registrador.error(err);
  });
 
}