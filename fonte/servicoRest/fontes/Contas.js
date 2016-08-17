'use strict';

/* A nossa configuração para a fonte Usuarios.
 * @Veja https://github.com/umdez/restificando/blob/master/docs/aConfiguracao.md
 */
var Contas = {
   nome: 'Usuarios'                 // É o nome dado a tabela (modelo) no banco de dados.
,  sePossuiAssociacoes: false       // Se possui associações.
,  seForRealizarPaginacao: false    // Caso seja necessário possuir suporte à paginação.
,  controladores: null              // Os controladores desta fonte.
,  controladoresFuncionais: null
,  seForRecarregarInstancias: true  // Recarrega as instancias
,  metodoDeAtualizacao: 'put'       // Qual será o método para atualização? put, post ou patch?  
};

Contas.estagiosFinais = [ // Os estágios para o serviço REST.
  '/Contas'              
, '/Contas/:id'          // Um registro em especifico.
];  

Contas.busca = {
  parametro: 'b'     // O parametro a ser utilizado na busca.
, operador: '$like'  // O operador a ser utilizado na busca.
, atributos: []      // Os atributos a serem incluidos nas buscas.
};

Contas.sorteio = {
  parametro: 's'  // O parametro de sorteio a ser utilizado.
, padrao: 'id'    // Parametro de sorteio padrão.
};

Contas.ordenamento = {
  parametro: 'o'  // O parametro de ordenamento a ser utilizado.
};

Contas.acoes = [ // As ações permitidas nesta fonte.
  'ler'           // Oferece a capacidade de ler um determinado registro desta fonte.
, 'deletar'       // Oferece a capacidade de deletar um determinado registro desta fonte. 
, 'criar'         // Oferece a capacidade de criar um registro nesta fonte.
, 'atualizar'     // Oferece a capacidade de atualizar um determinado registro desta fonte.
, 'listar'        // Oferece a capacidade de listar os registros desta fonte.
];                                           

Contas.excluirAtributos = [ // Os atributos que serão excluidos.
  
];        

var limitadorDeUso = require('limitador');

/* @Função controladoresFuncionais(). Os controladores funcionais desta fonte. 
 *  
 * @Veja https://github.com/umdez/restificando/blob/master/docs/aUtilizacao.md 
 */
Contas.controladoresFuncionais = function(fonte) {
  
  if (fonte == undefined) {
    return;
  }

  var limiteDeLeituras = new limitadorDeUso({
    intervalo: 60*60*1000, // 60 minutos.
    max: 150 // Apenas 150 requisições a cada intervalo.
  });

  var limiteDeListagens = new limitadorDeUso({
    intervalo: 60*60*1000, // 60 minutos.
    max: 150 // Apenas 150 requisições a cada intervalo.
  });

  fonte.ler.iniciar.antesQue(function(requisicao, resposta, contexto) {
    return limiteDeLeituras.Restificando(requisicao, resposta, contexto);
  });
  
  fonte.ler.iniciar.antesQue(function(requisicao, resposta, contexto) {
    // Aqui nós autenticamos.
    return contexto.continuar;
  });

  fonte.ler.iniciar(function(requisicao, resposta, contexto) {
    return contexto.continuar;
  });

  fonte.listar.iniciar.antesQue(function(requisicao, resposta, contexto) {
    return limiteDeListagens.Restificando(requisicao, resposta, contexto);
  });

  fonte.listar.iniciar(function(requisicao, resposta, contexto) {
    return contexto.continuar;
  });

  fonte.deletar.iniciar.antesQue(function(requisicao, resposta, contexto) {
    return contexto.erro(403, "Não é possível deletar este usuário.");
  });

  fonte.deletar.iniciar(function(requisicao, resposta, contexto) {
    return contexto.pular;
  });
  
};

module.exports = Contas;