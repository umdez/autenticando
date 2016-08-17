'use strict';

/*******************************************************************
 * Listificando é de (C) propriedade da Devowly Sistemas 2015-2016 *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id Armazenamento.js, criado em 19/07/2016 às 09:26 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

/* Realiza o inicio e carregamento dos nossos modelos de banco de dados.     
 */

var Base = require('../indice');

/* @Classe CarregaArmazenamento().
 ----------------------------------------*/
function CarregaArmazenamento() {}

/* @Método carregar().
 *
 * Realiza o inicio do nosso modulo de armazenamento.
 *
 * @Parametro {Objeto} [configuracao] Contêm as informações de configuração.
 * @Retorna {Promessa} Uma promessa de recusa ou de deliberação.
 */
CarregaArmazenamento.prototype.carregar = function (configuracao) {

  /* @Propriedade {Objeto} [minhaConfiguracao] As nossas configurações. */
  var minhaConfiguracao = configuracao.armazenamento;

  /* @Propriedade {Objeto} [asOpcoesDeSincronizacao] As opções de sincronização
  */
  var asOpcoesDeSincronizacao = { "force": minhaConfiguracao.seForForcarCriacaoDeNovasTabelas };

  /* @Propriedade {Objeto} [armazenamento] O módulo de armazenamento. */
  var armazenamento = new Base.Armazenamento(minhaConfiguracao);

  // Inicia sequelize e retorna promessa
  return armazenamento.iniciar(asOpcoesDeSincronizacao);

};

module.exports = CarregaArmazenamento;