'use strict';

/* A nossa configuração das contas para a fonte Usuarios.
 * @Veja https://github.com/umdez/restificando/blob/master/docs/aConfiguracao.md
 */

var Base = require('./base');
var utilitario = require('util');

var Contas = function(argumentos) {
  Contas.super_.call(this, argumentos);
  this.config = null;
  this.iniciar(argumentos);
};

utilitario.inherits(Contas, Base);

Contas.prototype.iniciar = function(opcoes) {
  this.config = this.carregarConfig(opcoes);
};

Contas.prototype.carregarConfig = function(opcoes) {

  var config = {
     nome: 'Usuarios'                 // É o nome dado a tabela (modelo) no banco de dados.
  ,  aliase: 'Contas'                 // Nome fantasia. Assim que diferenciamos fontes de mesmos modelos.
  ,  sePossuiAssociacoes: false       // Se possui associações.
  ,  seForRealizarPaginacao: false    // Caso seja necessário possuir suporte à paginação.
  ,  controladores: null              // Os controladores desta fonte.
  ,  controladoresFuncionais: null
  ,  seForRecarregarInstancias: true  // Recarrega as instancias
  ,  metodoDeAtualizacao: 'put'       // Qual será o método para atualização? put, post ou patch?  
  };

  config.estagiosFinais = [ 
    '/Contas'              
  , '/Contas/:id'  // Um registro em especifico.
  ];

  config.acoes = [ 
    'deletar'      // DELETE: Realiza a saida do usuário em sua conta.
  , 'criar'        // POST: Realiza a entrada do usuário em sua conta.
  , 'atualizar'    // PUT: Realiza a manutenção da sessão do usuário em sua conta.
  ]; 

  config.excluirAtributos = [ 
    'createdAt'
  , 'updatedAt'
  ];      

  return config;       
};

module.exports = Contas;