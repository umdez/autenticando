var jwt = require('../../nucleo/jwt');

var Controlador = function(argumentos) {
  this.inicializar(argumentos);
};

Controlador.prototype.inicializar = function(opcoes) {
  this.fonte = opcoes.fonte;
  this.modelo = opcoes.modelo;
  this.jwt = new jwt(opcoes);
  this.limitadorDeUso = require('limitador');
  this.limitar = [];
  this.token = null;
  this.jid = null;
  this.senha = null;
};

Controlador.prototype.criarUmLimite = function(opcoes) {
  this.limitar[opcoes.nome] = new this.limitadorDeUso(opcoes);
};

Controlador.prototype.afunilarServico = function(opcoes, requisicao, resposta, contexto) {
  return this.limitar[opcoes.nome].Restificando(requisicao, resposta, contexto);
};

Controlador.prototype.zerarUmLimite = function(opcoes, requisicao) {
  this.limitar[opcoes.nome].Restificando.reiniciarChave(requisicao.ip);
};

module.exports = Controlador;