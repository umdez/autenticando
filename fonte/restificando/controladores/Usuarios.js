var Base = require('./base');
var utilitario = require('util');

var Usuarios = function(argumentos) {
  Usuarios.super_.call(this, argumentos);

  this.limiteDeLeituras = this.criarUmLimite({ 
    nome: 'limiteDeRequisicoes', intervalo: 60*60*1000, max: 2 
  , mensagem: 'Muitas tentativas de leituras aos usuários. Por favor, tente novamente mais tarde.'
  });

  this.limiteDeListagens = this.criarUmLimite({ 
    nome: 'limiteDeListagens', intervalo: 60*60*1000, max: 150
  , mensagem: 'Muitas tentativas de listagens aos usuários. Por favor, tente novamente mais tarde.'
  });

  this.iniciar();
};

utilitario.inherits(Usuarios, Base);


Usuarios.prototype.iniciar = function() {
  
  var fonte = this.fonte || null;

  if (fonte === null) return;

  var meuObj = this;

  fonte.ler.iniciar.antesQue(function(requisicao, resposta, contexto) {
    return meuObj.limiteDeLeituras.afunilarSrvico(requisicao, resposta, contexto);
  });
  
  fonte.ler.iniciar.antesQue(function(requisicao, resposta, contexto) {
    return contexto.continuar;
  });

  fonte.ler.iniciar(function(requisicao, resposta, contexto) {
    return contexto.continuar;
  });

};

module.exports = Usuarios;