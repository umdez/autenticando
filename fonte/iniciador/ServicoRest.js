'use strict';

/*******************************************************************
 * Listificando é de (C) propriedade da Devowly Sistemas 2015-2016 *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id ServicoRest.js, criado em 19/07/2016 às 15:38 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

/* Realiza o inicio e carregamento dos serviços REST.  
 */

var baseDaFonte = require('../indice');
var ServicoRest = baseDaFonte.ServicoRest;

/* @Classe CarregaServicoRest().
 ----------------------------------*/
function CarregaServicoRest() {}

/* @Método carregar().
 *
 * Realiza o inicio do nosso modulo de serviço REST.
 *
 * @Parametro {Objeto} [aplicativo] O nosso aplicativo Express.
 * @Parametro {Objeto} [armazenamento] Contêm o métodos e propriedades do nosso sistema de armazenamento.
 * @Retorna {Promessa} Uma promessa que pode ser de recusa ou deliberação.
 */
CarregaServicoRest.prototype.carregar = function (aplicativo, armazenamento, configuracao) {

  /* @Propriedade {Objeto} [minhaConfiguracao] As nossas configurações. */
  var minhaConfiguracao = configuracao.servidorRest;

  /* @Propriedade {Objeto} [srvcRest] O módulo do serviço REST. */
  var servicoRest = new ServicoRest(aplicativo, armazenamento, minhaConfiguracao);

  // Inicia o serviço REST e retorna promessa.
  return servicoRest.iniciar();

};

module.exports = CarregaServicoRest;