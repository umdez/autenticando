'use strict';

/* Implementação do nosso serviço Restificando. Oferecemos aqui um suporte completa 
 * as fontes e controladores. 
 * @Veja https://github.com/umdez/restificando/blob/master/README.md
 */

var utilitario = require('util');
var EmissorDeEvento = require('events').EventEmitter;
var Promessa = require('bluebird');
var fontes = require('./fontes/indice');
var controladores = require('./controladores/indice');
var registrador = require('../nucleo/registrador')('restificando');
var restificando = require('restificando');
var _ = require('lodash');

var Restificando = function (opcoes) {

  EmissorDeEvento.call(this);

  if (!opcoes) {
    throw new Error('As opções de configuração do serviço REST não foram informadas.');
  }

  this.configuracao = opcoes.configuracao;

  _.defaults(this.configuracao, {         
     base: "" 
  });

  this.aplicativo = opcoes.aplicativo;

  this.modulos = opcoes.modulos;

  this.fontes = [];

  this.controladores = [];
};

Restificando.prototype.carregarAsFontes = function () {
  var meuObj = this;
  var moduloDb = this.modulos['bd'];

  fontes.forEach(function (f) {
    meuObj.fontes[f.aliase] = new f.Fonte({ });

    /* Carregamos cada uma das nossas fontes. Cada fonte possui as informações
     * necessárias para a criação de estágios finais, a adição de associações e
     * muitas outras caracteristicas para um modelo qualquer.
     * @Veja https://github.com/umdez/restificando/blob/master/docs/aConfiguracao.md
     */
   
    if (moduloDb.modelos.hasOwnProperty(f.modelo)) {

      var config = meuObj.fontes[f.aliase].config;
      
      _.defaults(config, {         
         acoes: ['criar', 'listar', 'ler', 'atualizar', 'deletar']
      ,  sePossuiAssociacoes: false  
      ,  seForRealizarPaginacao: false                 
      ,  seForRecarregarInstancias: false            
      ,  excluirAtributos: []            
      ,  metodoDeAtualizacao: 'put'
      ,  estagiosFinais: false
      ,  incluir: []
      ,  modelo: moduloDb.modelos[f.modelo]
      });

      _.defaultsDeep(config, {
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

      meuObj.fontes[f.aliase].fonte = restificando.fonte(config);

    } else {
      registrador.debug('Não encontramos o modelo (' + f.modelo + ') do banco de dados.');
    }
  });

  return meuObj.fontes;
};

Restificando.prototype.carregarOsControladores = function () {
  
  var meuObj = this;
  var moduloRest = this.modulos['rest'];
  var moduloDb = this.modulos['bd'];

  controladores.forEach(function (c) {
    var fonte = moduloRest.fontes[c.aliase].fonte;

    meuObj.controladores[c.aliase] = new c.Controlador({ 
     'fonte': fonte
    , modelos: moduloDb.modelos 
    });
  });

  return meuObj.controladores;

};

Restificando.prototype.iniciar = function () {

  registrador.debug('Iniciando serviço REST Restificando.');

  var meuObj = this;
  var config = this.configuracao;
  var moduloDb = this.modulos['bd'];
  var moduloRest = this.modulos['rest'];

  return new Promessa(function (deliberar, recusar) {

    restificando.inicializar({
      aplicativo: meuObj.aplicativo,             
      sequelize: moduloDb.sequelize, 
      base: config.base 
    });
    
    moduloRest.fontes = meuObj.carregarAsFontes();
    
    moduloRest.controladores = meuObj.carregarOsControladores();

    deliberar(meuObj);

  });
};

module.exports = Restificando;