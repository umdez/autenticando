'use strict';

/*******************************************************************
 * Listificando é de (C) propriedade da Devowly Sistemas 2015-2016 *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id indice.js, criado em 19/07/2016 às 15:46 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

/* Realiza o carregamento do nosso serviço REST.
 */

var utilitario = require('util');
var Promessa = require('bluebird');
var fontes = require('./fontes/indice');
var registrador = require('../nucleo/registrador')('servicorest');
var restificando = require('restificando');
var _ = require('lodash');

/* @Classe ServicoRest().
 *
 * Abstração da gerencia das rotas do serviço REST. Realiza o carregamento das
 * rotas REST do nosso servidor.
 *
 * @Parametro {Objeto} [aplicativo] O nosso aplicativo Express.
 * @Parametro {Objeto} [armazenamento] Contêm o objeto do nosso banco de dados.
 * @Parametro {Objeto} [configuracao] Contem todas as configurações deste serviço.
 ----------------------------------------------------------------------------------------------------------------------------------------*/
var ServicoRest = function (aplicativo, armazenamento, configuracao) {

  if (!aplicativo) {
    throw new Error('É necessário do servidor express para este serviço Rest.');
  } else if(!armazenamento) {
    throw new Error('É necessário do serviço de armazenamento para o serviço Rest.');
  } else if(!configuracao) {
    throw new Error('As configurações requisitadas para o serviço Rest não foram informadas.');
  }

  /* @Propriedade {Objeto} [armazenamento] Classe de armazenamento para o
   * Sequelize. 
   */
  this.armazenamento = armazenamento; 
   
  /* @Propriedade {Objeto} [aplicativo] Armazena aplicativo express. */  
  this.aplicativo = aplicativo;
  
  // Nossas opções padrões
  _.defaults(configuracao, {         
     base: ''   
  });
  
  /* @Propriedade {Objeto} [minhaConfiguracao] As configurações para este
   * serviço. 
   */
  this.minhaConfiguracao = configuracao;
};

/* @Método carregarAsFontes().
 *
 * Carregamos cada uma das nossas fontes. Cada fonte possui as informações
 * necessárias para a criação de estágios finais, a adição de associações e
 * muitas outras caracteristicas para um modelo qualquer.
 */
ServicoRest.prototype.carregarAsFontes = function () {
  this.minhasFontes = fontes();
};

/* @Método carregarNossoServicoRest().  
 *
 * Realiza o iniciar do serviço REST para cada uma das nossas fontes.
 */
ServicoRest.prototype.carregarNossoServicoRest = function () {
  
  var esteObjeto = this;
  
  this.minhasFontes.forEach(function (fonte) {
    
    // Verificamos inicialmente se existe esse modelo.
    if (esteObjeto.armazenamento.hasOwnProperty(fonte.nome)) {
      
      /* Carregamos aqui a nossa fonte. Os parametros possiveis são listados
       * abaixo:
       *
       * - opcoes.acoes (Opcional) As ações aceitas por esta fonte.
       *
       * - opcoes.seForRealizarPaginacao (Opcional) Caso seja necessário
       * habilitar a paginação para determinada fonte.
       *
       * - opcoes.seForRecarregarInstancias (Opcional)
       *
       * - opcoes.incluir (Opcional) Vamos incluir mais alguns modelos?
       *
       * - opcoes.excluirAtributos (Opcional) Os atributos não necessários e que
       * devem ser excluidos.
       *
       * - opcoes.busca.parametro (Opcional) O parametro utilizado para a busca.
       *
       * - opcoes.sorteio.parametro (Opcional) O parametro utilizado para
       * sorteio.
       *
       * - opcoes.modelo (Obrigatório) Um modelo do Sequelize.
       *
       * - opcoes.estagiosFinais (Opcional) Os estágio de determinada fonte.
       *
       * - opcoes.metodoDeAtualizacao (Opcional mas recomendado) Qual será o
       * método para atualização? put, post ou patch?
       *
       * - opcoes.sePossuiAssociacoes (Opcional) Caso a fonte possua associações
       * com outras fontes.
       *
       * @Veja https://github.com/umdez/restificando/blob/master/docs/aConfiguracao.md
       */
      
      _.defaults(fonte, {         
         acoes: ['criar', 'listar', 'ler', 'atualizar', 'deletar']
      ,  sePossuiAssociacoes: false  
      ,  seForRealizarPaginacao: false                 
      ,  seForRecarregarInstancias: false            
      ,  excluirAtributos: []            
      ,  metodoDeAtualizacao: 'put'
      ,  estagiosFinais: false
      ,  incluir: []
      ,  modelo: esteObjeto.armazenamento[fonte.nome]
      });
      
      _.defaultsDeep(fonte, {
        busca: {
          parametro: 'busc',
          operador: '$like',
          atributos: undefined
        },
        sorteio: {
          parametro: 'sort',
          atributos: undefined,
          padrao: undefined
        },
        ordenamento: {
          parametro: 'ord'  
        }
      });
      
      // Em caso de já existir duas fontes para um mesmo modelo. Então
      // utilizamos um nome fantasia ou aliase. Desse jeito fica mais simples.
      var nomeUtilizado = fonte.aliase || fonte.nome;

      // Carregamos as fontes deste determinado modelo.
      esteObjeto[nomeUtilizado] = restificando.fonte(fonte);
      
      // Acrescentamos aqui à nossa fonte os seus controladores.
      if (fonte.controladores){
        var osControladoresUsados = fonte.controladores();
        esteObjeto[nomeUtilizado].usar(osControladoresUsados);
      }
      
      // Acrescentamos aqui os controladores funcionais a esta fonte.
      if (fonte.controladoresFuncionais) {
        fonte.controladoresFuncionais(esteObjeto[nomeUtilizado]);
      }

    } else {
      registrador.debug('Não encontramos o modelo (' + fonte.nome + ') do banco de dados.');
    }
  });
   
};

/* @Método iniciar(). 
 *
 * Realiza o inicio do serviço REST Restificando e logo em seguida carrega o
 * serviço REST para cada um dos modelos do banco de dados.
 *
 * @Retorna {Promessa} Promessa de recusa ou de deliberação. 
 */
ServicoRest.prototype.iniciar = function () {

  registrador.debug('Iniciando serviço REST Restificando.');

  var esteObjeto = this;

  return new Promessa(function (deliberar, recusar) {

    // Inicia o serviço REST Restificando.
    restificando.inicializar({
      aplicativo: esteObjeto.aplicativo,             // Aplicativo Express.
      sequelize: esteObjeto.armazenamento.sequelize, // Nosso ORM Sequelize.
      base: esteObjeto.minhaConfiguracao.base        // A nossa base do serviço. ex. /listificando
    });
    
    // Carregamos aqui as nossas fontes.
    esteObjeto.carregarAsFontes();
    
    // Carrega os arquivos que contem os nossos modelos.
    esteObjeto.carregarNossoServicoRest();

    // Se tudo ocorreu bem.
    deliberar(esteObjeto);
    
  });
};

module.exports = ServicoRest;