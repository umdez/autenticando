var jwt = require('../../nucleo/jwt');

var Controlador = function(argumentos) {
  this.inicializar(argumentos);
};

Controlador.prototype.inicializar = function(opcoes) {
  this.fonte = opcoes.fonte;
  this.modelos = opcoes.modelos;
  this.jwt = new jwt(opcoes);
  this.limitadorDeUso = require('limitador');
  this.limitar = [];
  this.token = null;
  this.jid = null;
};

Controlador.prototype.criarUmLimite = function(opcoes) {
  this.limitar[opcoes.nome] = new this.limitadorDeUso(opcoes);
  this.limitar[opcoes.nome].dados = opcoes;
  this.limitar[opcoes.nome].afunilarSrvico = this.afunilarServico.bind({dados: this.limitar[opcoes.nome]});
  this.limitar[opcoes.nome].zerarLimite = this.zerarUmLimite.bind({dados: this.limitar[opcoes.nome]});
  return this.limitar[opcoes.nome];
};

Controlador.prototype.afunilarServico = function(requisicao, resposta, contexto) {
  return this.dados.Restificando(requisicao, resposta, contexto);
};

Controlador.prototype.zerarUmLimite = function(requisicao) {
  return this.dados.Restificando.reiniciarChave(requisicao.ip);
};

module.exports = Controlador;