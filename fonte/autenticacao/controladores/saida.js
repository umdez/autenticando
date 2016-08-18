var Base = require('./base');
var utilitario = require('util');
var _ = require('lodash');

var Saida = function(argumentos) {
  Saida.super_.call(this, argumentos);
   
  this.limiteDeSaidas = {
    nome: 'limiteDeSaidas'
  , intervalo: 30*60*1000 // 30 minutos.
  , max: 20               // Apenas 10 requisições a cada intervalo.
  };

  this.iniciar();
};

utilitario.inherits(Saida, Base);

Saida.prototype.iniciar = function() {
  
  if (this.fonte == undefined) {
     return;
  }

  var esteObj = this;
  this.criarUmLimite(this.limiteDeSaidas);

  this.fonte.deletar.iniciar.antesQue(function(requisicao, resposta, contexto) {
    return esteObj.afunilarServico(esteObj.limiteDeSaidas, requisicao, resposta, contexto);
  });
  
  this.fonte.deletar.iniciar.antesQue(function(requisicao, resposta, contexto) {
    //req.session
    //requisicao.body;
    //console.log(requisicao.body);
    return contexto.continuar;
  });

  this.fonte.deletar.iniciar(function(requisicao, resposta, contexto) {
    return contexto.continuar;
  });

  this.fonte.deletar.escrever.antesQue(function(requisicao, resposta, contexto) {
    // Impedimos a remoção desta conta
    return contexto.pular;
  });

  this.fonte.deletar.escrever(function(requisicao, resposta, contexto) {
    return contexto.pular;
  });

  this.fonte.deletar.enviar.antesQue(function(requisicao, resposta, contexto) {
    return contexto.continuar;
  });
};

module.exports = Saida;