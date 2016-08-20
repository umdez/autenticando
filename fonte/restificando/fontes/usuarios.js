'use strict';

/* A nossa configuração para a fonte Usuarios.
 * @Veja https://github.com/umdez/restificando/blob/master/docs/aConfiguracao.md
 */

var Base = require('./base');
var utilitario = require('util');

var Usuarios = function(argumentos) {
  Usuarios.super_.call(this, argumentos);
  this.config = null;
  this.iniciar(argumentos);
};

utilitario.inherits(Usuarios, Base);

Usuarios.prototype.iniciar = function(opcoes) {
  this.config = this.carregarConfig(opcoes);
};   

Usuarios.prototype.carregarConfig = function(opcoes) {

  var config = {
    nome: 'Usuarios'                 // É o nome dado a tabela (modelo) no banco de dados.
  ,  sePossuiAssociacoes: false       // Se possui associações.
  ,  seForRealizarPaginacao: true     // Caso seja necessário possuir suporte à paginação.
  ,  controladores: null              // Os controladores desta fonte.
  ,  controladoresFuncionais: null
  ,  seForRecarregarInstancias: true  // Recarrega as instancias
  ,  metodoDeAtualizacao: 'put'       // Qual será o método para atualização? put, post ou patch?  
  };

  config.estagiosFinais = [ 
    '/Usuarios'              
  , '/Usuarios/:id'  // Um registro em especifico.
  ];  

  config.busca = {
    parametro: 'b'     // O parametro a ser utilizado na busca.
  , operador: '$like'  // O operador a ser utilizado na busca.
  , atributos: []      // Os atributos a serem incluidos nas buscas.
  };

  config.sorteio = {
    parametro: 's'  // O parametro de sorteio a ser utilizado.
  , padrao: 'id'    // Parametro de sorteio padrão.
  };

  config.ordenamento = {
    parametro: 'o'  // O parametro de ordenamento a ser utilizado.
  };

  config.acoes = [ 
    'ler'         // Oferece a capacidade de ler um determinado registro desta fonte.
  , 'deletar'     // Oferece a capacidade de deletar um determinado registro desta fonte. 
  , 'criar'       // Oferece a capacidade de criar um registro nesta fonte.
  , 'atualizar'   // Oferece a capacidade de atualizar um determinado registro desta fonte.
  , 'listar'      // Oferece a capacidade de listar os registros desta fonte.
  ];   

  config.excluirAtributos = [ ];     

  return config;       
};

module.exports = Usuarios;