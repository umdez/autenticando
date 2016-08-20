'use strict';

/* Implementação do nosso armazenamento de dados. Oferecendo o suporte completo
 * de um Banco de Dados relacional ao nosso aplicativo. 
 * @Veja http://docs.sequelizejs.com/en/latest/
 */

var utilitario = require('util');
var EmissorDeEvento = require('events').EventEmitter;
var Sequelize = require('sequelize');
var SequelizeI18N = require('sequelize-i18n');
var Promessa = require('bluebird');
var modelos = require('./modelos/indice');
var registrador = require('../nucleo/registrador')('armazenamento');
var _ = require('lodash');

var Armazenamento = function (opcoes) {

  EmissorDeEvento.call(this);

  if (!opcoes) {
    throw new Error('As opções de configuração do banco de dados não foram informadas.');
  }

  this.configuracao = opcoes.configuracao;

  _.defaults(this.configuracao, {         
    maxDeConsultasConcorrentes: 100  
  , maxDeConexoes: 1                 
  , maxTempInativo: 30
  , dialeto: 'mysql'
  , endereco: '127.0.0.1'
  , porta: 3306
  });

  this.aplicativo = opcoes.aplicativo;

  this.modulos = opcoes.modulos;

  this.modelos = [];
};

utilitario.inherits(Armazenamento, EmissorDeEvento);

Armazenamento.prototype.carregarOsModelos = function () {
  modelos(this.sequelize, this.modelos);
  return this.modelos;
};

Armazenamento.prototype.iniciar = function () {
  
  registrador.debug('Iniciando armazenamento');
  
  var meuObj = this;
  var config = this.configuracao;
  var moduloDb = this.modulos['bd'];

  return new Promessa(function (deliberar, recusar) {                     

    var opcoes = {
      //language: 'en',
      dialect: config.dialeto,
      host: config.endereco,
      port: config.porta,
      maxConcurrentQueries: config.maxDeConsultasConcorrentes, 
      pool: {
        maxConnections: config.maxDeConexoes,   
        maxIdleTime: config.maxTempInativo    
      }
    };
    
    var sequelize = new Sequelize(config.database, config.usuario, config.senha, opcoes);
    
    moduloDb.sequelize = meuObj.sequelize = sequelize;

    var i18n = new SequelizeI18N(sequelize, { 
      languages: ["EN", "PT"], default_language: "PT" 
    });

    i18n.init();

    moduloDb.modelos = meuObj.carregarOsModelos();

    sequelize.sync({
      "force": config.seForForcarCriacaoDeNovasTabelas
    }).then(function() {
      deliberar(meuObj);
    }).catch(function(erro){
      registrador.error(erro);
      recusar(erro);
    }); 
   
  });
};

module.exports = Armazenamento;