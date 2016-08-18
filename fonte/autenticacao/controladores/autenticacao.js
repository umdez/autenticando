var Base = require('./base');
var utilitario = require('util');
var _ = require('lodash');

var Autenticacao = function(argumentos) {
  Autenticacao.super_.call(this, argumentos);
   
  this.limiteDeAutenticacoes = {
    nome: 'limiteDeAutenticacoes'
  , intervalo: 30*60*1000 // 30 minutos.
  , max: 10               // Apenas 10 requisições a cada intervalo.
  };

  this.iniciar();
};

utilitario.inherits(Autenticacao, Base);

Autenticacao.prototype.iniciar = function() {
  
  if (this.fonte == undefined) {
     return;
  }

  var esteObj = this;
  this.criarUmLimite(this.limiteDeAutenticacoes);

  this.fonte.criar.iniciar.antesQue(function(requisicao, resposta, contexto) {
    //esteObj.zerarUmLimite(esteObj.limiteDeAutenticacoes, requisicao);
    return esteObj.afunilarServico(esteObj.limiteDeAutenticacoes, requisicao, resposta, contexto);
  });
  
  this.fonte.criar.iniciar.antesQue(function(requisicao, resposta, contexto) {
    //req.session
    //requisicao.body;
    //console.log(requisicao.body);
    return contexto.continuar;
  });

  this.fonte.criar.iniciar(function(requisicao, resposta, contexto) {
    //req.session
    //requisicao.body
    return contexto.continuar;
  });

  this.fonte.criar.escrever.antesQue(function(requisicao, resposta, contexto) {
    return contexto.pular;  // Impedimos a escrita de dados
  });

  this.fonte.criar.escrever(function(requisicao, resposta, contexto) {
    return contexto.pular;  // Impedimos a escrita de dados
  });

  this.fonte.criar.enviar.antesQue(function(requisicao, resposta, contexto) {
    //contexto.instancia.dataValues['nome'] = "Louro Jose";
    //delete contexto.instancia.dataValues['senha'];
    //delete contexto.instancia.dataValues['jid'];
    
    //console.log(contexto.instancia);
    //contexto.instancia.dataValues.forEach(function(i) {
      //i.dataValues.forEach(function(d){
      //  console.log(d);
      //}); 
      //console.log(i.dataValues);
    //});
    return contexto.continuar;
  });
  
};

module.exports = Autenticacao;