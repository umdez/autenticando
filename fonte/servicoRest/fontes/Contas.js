'use strict';

/* A nossa configuração para a fonte Usuarios.
 * @Veja https://github.com/umdez/restificando/blob/master/docs/aConfiguracao.md
 */
var Contas = {
   nome: 'Usuarios'                 // É o nome dado a tabela (modelo) no banco de dados.
,  aliase: 'Contas'                 // Nome fantasia. Assim que diferenciamos fontes de mesmos modelos.
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
  'deletar'      // DELETE: Realiza a saida do usuário em sua conta.
, 'criar'        // POST: Realiza a entrada do usuário em sua conta.
, 'atualizar'    // PUT: Realiza a manutenção da sessão do usuário em sua conta.
];                                           

Contas.excluirAtributos = [ // Os atributos que serão excluidos.
  
];        

module.exports = Contas;