var Base = require('./base');
var utilitario = require('util');
var _ = require('lodash');

var Sessao = function(argumentos) {
  Sessao.super_.call(this, argumentos);
   
  this.limiteDeSessoes = {
    nome: 'limiteDeSessoes'
  , intervalo: 60*60*1000  // 60 minutos.
  , max: 150               // Apenas 150 requisições a cada intervalo.
  };

  this.iniciar();
};

utilitario.inherits(Sessao, Base);

Sessao.prototype.iniciar = function() {
  
  if (this.fonte == undefined) {
     return;
  }

  var esteObj = this;
  this.criarUmLimite(this.limiteDeSessoes);

  this.fonte.atualizar.iniciar.antesQue(function(requisicao, resposta, contexto) {
    return esteObj.afunilarServico(esteObj.limiteDeSessoes, requisicao, resposta, contexto);
  });
  
  this.fonte.atualizar.iniciar.antesQue(function(requisicao, resposta, contexto) {
    //req.session
    //requisicao.body;
    //console.log(requisicao.body);
    return contexto.continuar;
  });

  this.fonte.atualizar.iniciar(function(requisicao, resposta, contexto) {
    //req.session
    //requisicao.body
    return contexto.continuar;
  });

  this.fonte.atualizar.escrever.antesQue(function(requisicao, resposta, contexto) {
    return contexto.pular;  // Impedimos as alterações dos dados
  });

  this.fonte.atualizar.escrever(function(requisicao, resposta, contexto) {
    return contexto.pular;  // Impedimos as alterações dos dados
  });

};

module.exports = Sessao;