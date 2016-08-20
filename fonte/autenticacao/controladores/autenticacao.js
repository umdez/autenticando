var Base = require('./base');
var utilitario = require('util');

var Autenticacao = function(argumentos) {
  Autenticacao.super_.call(this, argumentos);
   
  this.limiteDeAutenticacoes = this.criarUmLimite({
    nome: 'limiteDeAutenticacoes', intervalo: 20*60*1000, max: 10               
  , mensagem: 'Muitas tentativas de autenticação. Por favor, tente novamente mais tarde.'
  });

  this.iniciar();
};

utilitario.inherits(Autenticacao, Base);

Autenticacao.prototype.iniciar = function() {
  var fonte = this.fonte || null;

  if (fonte === null) return;
  
  var meuObj = this;

  fonte.criar.iniciar.antesQue(function(requisicao, resposta, contexto) {
    return meuObj.limiteDeAutenticacoes.afunilarSrvico(requisicao, resposta, contexto);
  });
  
  fonte.criar.iniciar.antesQue(function(requisicao, resposta, contexto) {
    return meuObj.jwt.autenticar(requisicao, resposta, contexto, function(seAutenticado) {
      if (seAutenticado) {
        //meuObj.limiteDeAutenticacoes.zerarLimite(requisicao);
      }
    });
  });

  fonte.criar.iniciar(function(requisicao, resposta, contexto) {
    return contexto.continuar;
  });

  fonte.criar.escrever.antesQue(function(requisicao, resposta, contexto) {
    // NOTA: Precisamos apenas receber as requisições. Não precisamos alterar
    // nenhum dado, portanto, nós impedimos qualquer escrita na database.
    return contexto.pular; 
  });

  fonte.criar.escrever(function(requisicao, resposta, contexto) {
    return contexto.pular;  // Impedimos a escrita de dados
  });

  fonte.criar.enviar.antesQue(function(requisicao, resposta, contexto) {
    return contexto.continuar;
  });
  
};

module.exports = Autenticacao;