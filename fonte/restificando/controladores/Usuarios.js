var limitadorDeUso = require('limitador');

/* @Função controladoresFuncionais(). Os controladores funcionais desta fonte. 
 *  
 * @Veja https://github.com/umdez/restificando/blob/master/docs/aUtilizacao.md 
 */
Usuarios.controladoresFuncionais = function(fonte) {
  
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