var jwt = require('jsonwebtoken');
var Promessa = require('bluebird');

var jsonWebToken = function(argumentos) {
  this.inicializar(argumentos);
};

jsonWebToken.prototype.inicializar = function(opcoes) {
  this.modelo = opcoes.modelo;
  this.token = null;
  this.jid = null;
  this.senha = null;
};

jsonWebToken.prototype.encontrarUmToken = function(requisicao) {
  // Inicialmente procuramos pelo token numa sessão segura se caso não
  // encontrado, procuramos no body e também depois no cabeçalho.
  if (requisicao.session && requisicao.session.token) {
    this.token = requisicao.session.token; 
  } else if (requisicao.body && requisicao.body.token) {
    this.token = requisicao.body.token;
  } else if (requisicao.headers['x-acesso-token']) {
    this.token = requisicao.headers['x-acesso-token'];
  }
  return this.token;
};

jsonWebToken.prototype.encontrarUmJid = function(requisicao) {
  if (requisicao.body && requisicao.body.jid) {
    this.jid = requisicao.body.jid; 
  } else if (requisicao.params && requisicao.params.jid) {
    this.jid = requisicao.params.jid;
  } else if (requisicao.headers['x-autenticacao-jid']) {
    this.jid = requisicao.headers['x-autenticacao-jid'];
  }
  return this.jid;
};

jsonWebToken.prototype.encontrarUmaSenha = function(requisicao) {
  if (requisicao.body && requisicao.body.senha) {
    this.senha = requisicao.body.senha;
  } else if (requisicao.params && requisicao.params.senha) {
    this.senha = requisicao.params.senha;
  } else if (requisicao.headers['x-autenticacao-senha']) {
    this.senha = requisicao.headers['x-autenticacao-senha'];
  }
  return this.senha;
};

jsonWebToken.prototype.autenticar = function(requisicao, resposta, contexto, cd) {
  var meuObj = this;
  this.encontrarUmJid(requisicao);
  this.encontrarUmaSenha(requisicao);
 
  return new Promessa(function(deliberar, recusar) {

    if (meuObj.jid && meuObj.senha) {
      
     return meuObj.modelo.findOne({
        where: {
          jid: meuObj.jid
        }
      }).then(function (conta) {
        if (conta == null) {
          deliberar(contexto.erro(403, "Dados de acesso informados estão incorretos."));
        } else {
          var seSenhaConfere = meuObj.senha ? conta.verificarSenha(meuObj.senha) : false;
          if (seSenhaConfere) {
            var dados = {
              'id': conta.id,
              'usuario': {
                'id': conta.id,
                'nome': conta.nome,
                'jid': conta.jid
              }
            };

            meuObj.token = jwt.sign(dados, conta.uuid, { expiresInMinutes: (14*60) });

            // AFAZER: Descobrir como fazer para informar o token apenas de uma
            // forma (Ou no session ou na resposta).
            resposta.token = meuObj.token;  
            if (requisicao.session) {
              requisicao.session.token = meuObj.token;
            } 
            
            cd(true);

            resposta.autenticado = true; 

            deliberar(contexto.continuar);
          } else {
            deliberar(contexto.erro(403, "Dados de acesso informados estão incorretos."));
          }
        }
      });

    } else {
      deliberar(contexto.erro(403, "Dados de acesso informados estão incorretos."));
    }

    deliberar(contexto.continuar);
  });
};

jsonWebToken.prototype.autorizar = function(requisicao, resposta, contexto) {
  var meuObj = this;
  return new Promessa(function(deliberar, recusar) {
    deliberar(contexto.continuar);
  });
};  

module.exports = jsonWebToken;