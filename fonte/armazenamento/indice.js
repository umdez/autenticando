'use strict';

/*******************************************************************
 * Listificando é de (C) propriedade da Devowly Sistemas 2015-2016 *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id indice.js, criado em 19/07/2016 às 13:19 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

/* Implementação do nosso armazenamento de dados. Oferecendo o suporte completo
 * de um Banco de Dados relacional ao nosso aplicativo. @Veja
 * http://docs.sequelizejs.com/en/latest/
 */

var utilitario = require('util');
var EmissorDeEvento = require('events').EventEmitter;
var Sequelize = require('sequelize');
var Promessa = require('bluebird');
var modelos = require('./modelos/indice');
var registrador = require('../nucleo/registrador')('armazenamento');
var _ = require('lodash');

/* @Classe Armazenamento().
 *
 * Contêm as funções para a gerencia da database. Aqui iremos tentar uma conexão
 * com o nosso banco de dados. Para a conexão estaremos utilizando o Sequelize.
 * Assim que a conexão for realizadas nós iremos sincronizar com o banco,
 * faremos isso ao carregarmos todos os arquivos de modelos do nosso banco. Ao
 * final nós teremos cada modelo como uma propriedades desta classe, por
 * exemplo, quando carregarmos o modelo de nome Slide, ele poderá ser acesso a
 * qualquer momento utilizando this.Slide ou this[Slide].
 *
 * As configurações obrigatórias e opcionais para o armazenamento estão listadas
 * abaixo:
 *
 * - dialeto {Texto}  (Obrigatório) O dialeto usado. Podendo ser: mysql,
 * postgres ou então sqlite.
 *
 * - porta {Número} (Opcional e Recomendado) A porta utilizada para conexão com
 * o nosso banco de dados. Exeto para o SQlite.
 *
 * - endereco {Texto}  (Opcional e Recomendado) O endereço do nosso banco de
 * dados. Exeto para o SQlite.
 *
 * - senha {Texto}  (Obrigatório) A nossa senha de conexão com o banco. Exeto
 * para o SQlite.
 *
 * - database {Texto}  (Obrigatório) O nome do banco utilizado.
 *
 * - usuario {Texto}  (Obrigatório) O nome do usuário do banco. Exeto para o
 * SQLite.
 *
 * - maxDeConsultasConcorrentes {Número} (Opcional) Valor máximo de consultas
 * concorrentes.
 *
 * - maxDeConexoes {Número} (Opcional) Valo máximo de conexões.
 *
 * - maxTempInativo {Número} (Opcional) Tempo máximo inativo.
 *
 * @Parametro {Objeto} [configuracao] Contem todas as configurações deste serviço.
 --------------------------------------------------------------------------------------------------------------*/
var Armazenamento = function (configuracao) {
  
  EmissorDeEvento.call(this);

  if (!configuracao) {
    throw new Error('As configurações requisitadas para a database não foram informadas.');
  }

  // Nossas opções padrões
  _.defaults(configuracao, {         
    maxDeConsultasConcorrentes: 100  // Valor máximo de consultas concorrentes.
  , maxDeConexoes: 1                 // Valo máximo de conexões.
  , maxTempInativo: 30               // Tempo máximo inativo.
  });
  
  /* @Propriedade {Objeto} [minhaConfiguracao] As configurações para o armazenamento. */
  this.minhaConfiguracao = configuracao;
  
};

utilitario.inherits(Armazenamento, EmissorDeEvento);

/* @Método carregarOsModelos().
 *
 * Carrega todos modelos da pasta modelos e cada um deles é adicionado a este
 * objeto. Por exemplo, o modelo Slide será armazenado em this.Slide ou
 * this[Slide]. Sendo assim a gente pode acessar daqui os diversos modelos.
 */
Armazenamento.prototype.carregarOsModelos = function () {
  modelos(this.sequelize, this);
};

/* @Método [Público] iniciar(). 
 *
 * Inicia o nosso banco de dados e sincroniza as tabelas se elas não estiverem
 * lá.
 *
 * Algumas configurações são listadas abaixo:
 *
 * - force {Boleano} (Opcional) Se for verdadeiro (true) irá primeiramente
 * remover (drop) as tabelas antes de as criar novamente.
 *
 * @Parametro {Objeto} [asOpcoesDeSincronizacao] Configura as opções de sincronização.
 * @Retorna {Promessa} Uma promessa de recusa em caso de erro, ou de deliberação se tudo correr bem.
 */
Armazenamento.prototype.iniciar = function (asOpcoesDeSincronizacao) {

  registrador.debug('Iniciando armazenamento');

  asOpcoesDeSincronizacao = asOpcoesDeSincronizacao || { "force": false };
  var esteObjeto = this;

  return new Promessa(function (deliberar, recusar) {

    var maxDeConsultasConcorrentes = esteObjeto.minhaConfiguracao.maxDeConsultasConcorrentes ;  // Valor máximo de consultas concorrentes.
    var maxDeConexoes = esteObjeto.minhaConfiguracao.maxDeConexoes;                             // Valo máximo de conexões.
    var maxTempInativo = esteObjeto.minhaConfiguracao.maxTempInativo;                           // Tempo máximo inativo.

    // As opções base
    var opcoes = {
      language: 'en',
      maxConcurrentQueries: maxDeConsultasConcorrentes, // Valor máximo de consultas concorrentes.
      pool: {
        maxConnections: maxDeConexoes,   // Valo máximo de conexões.
        maxIdleTime: maxTempInativo      // Tempo máximo inativo.
      }
    };

    // O dialeto utilizado. Poderia ser sqlite, postgres ou mysql.
    if (esteObjeto.minhaConfiguracao.dialeto) {
      opcoes.dialect = esteObjeto.minhaConfiguracao.dialeto;
    }

    // Endereço do banco de dados.
    if (esteObjeto.minhaConfiguracao.endereco) {
      opcoes.host = esteObjeto.minhaConfiguracao.endereco;
    }

    // Porta do banco de dados.
    if (esteObjeto.minhaConfiguracao.porta) {
      opcoes.port = esteObjeto.minhaConfiguracao.porta;
    }

    // Pasta do banco de dados para o sqlite <umdez> Obsoleto?
    if (esteObjeto.minhaConfiguracao.storage) {
      opcoes.storage = esteObjeto.minhaConfiguracao.storage;
    }
    
    // Inicia conexão com o banco de dados.
    var sequelize = new Sequelize(
      esteObjeto.minhaConfiguracao.database,
      esteObjeto.minhaConfiguracao.usuario,
      esteObjeto.minhaConfiguracao.senha,
      opcoes
    );
      
    // Armazenamos o sequelize para utilização das outras classes.
    esteObjeto.sequelize = sequelize;

    // Carrega os arquivos que contem os nossos modelos.
    esteObjeto.carregarOsModelos();

    // Sincroniza os modelos com o banco de dados.
    sequelize.sync(asOpcoesDeSincronizacao).then(function() {
      deliberar(esteObjeto);
    }).catch(function(erro){
      registrador.error(erro);
      recusar(erro);
    }); 
   
  });
};

module.exports = Armazenamento;