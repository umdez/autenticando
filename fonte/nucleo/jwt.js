var jwt = require('jsonwebtoken');
var Promessa = require('bluebird');

var jsonWebToken = function(argumentos) {
  this.inicializar(argumentos);
};

jsonWebToken.prototype.inicializar = function(opcoes) {
  this.modelos = opcoes.modelos;
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
      
     return meuObj.modelos['Usuarios'].findOne({
        attributes: ['id', 'nome', 'jid', 'uuid', 'senha'], 
        where: {
          jid: meuObj.jid
        }, 
        include: [{
          model: meuObj.modelos['Funcoes'],
          as: 'Funcoes',
          attributes: ['bandeira']
        }]
      }).then(function (conta) {
        
        if (conta == null) {
          deliberar(contexto.erro(403, "Dados de acesso informados estão incorretos."));
        } else {
          var seSenhaConfere = meuObj.senha ? conta.verificarSenha(meuObj.senha) : false;
          if (seSenhaConfere) {
            
            var bandeiras = null;
            
            if (conta.Funcoes && conta.Funcoes.dataValues) {
              bandeiras = conta.Funcoes.dataValues['bandeira'];
            }

            var usuario = {
               'id': conta.id
             , 'jid': conta.jid
             , 'uuid': conta.uuid
             , 'bandeiras': bandeiras
            };
            
            meuObj.token = jwt.sign(usuario, "superSegredo", { expiresInMinutes: (14*60) });

            var instancia = {
              'id': conta.id
            , 'autenticado': true
            , 'nome': conta.nome
            , 'jid': conta.jid
            , 'uuid': conta.uuid 
            , 'bandeiras': bandeiras
            };

            if (requisicao.session) {
              requisicao.session.token = meuObj.token;
            } else {
              instancia.token = meuObj.token; 
            }
            
            cd(true);

            contexto.instancia = instancia;

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

jsonWebToken.prototype.autorizar = function(requisicao, resposta, contexto, cd) {
  var meuObj = this;
  this.encontrarUmToken(requisicao);

  return new Promessa(function(deliberar, recusar) {

    if (meuObj.token) {
      
      jwt.verify(meuObj.token, "superSegredo", function (erro, decodificado) {
        if (erro) {
          // erro.name: 'TokenExpiredError' ou outros
          // erro.message: Mensagem sobre o erro ocorrido.
          
          if (requisicao.session) requisicao.session.regenerate(function(erro) {});

          deliberar(contexto.erro(403, "Dados de acesso informados estão incorretos."));
        } else if (decodificado) {
          var instancia = { 
            'id': decodificado.id
          , 'jid': decodificado.jid
          , 'uuid': decodificado.uuid
          , 'autenticado': true
          };
          
          cd(true);

          contexto.instancia = instancia;
          deliberar(contexto.continuar);
        } else {
          
          if (requisicao.session) requisicao.session.regenerate(function(erro) {});

          deliberar(contexto.erro(403, "Dados de acesso informados estão incorretos."));
        }
      });
    } else {
      deliberar(contexto.erro(403, "Dados de acesso informados estão incorretos."));
    }
  });
};  

jsonWebToken.prototype.sair = function(requisicao, resposta, contexto, cd) {
  var meuObj = this;
  this.encontrarUmToken(requisicao);

  return new Promessa(function(deliberar, recusar) {
   
    if (requisicao.session) requisicao.session.regenerate(function(erro) {});  

    var instancia = { };
          
    cd(true);

    contexto.instancia = instancia;

    deliberar(contexto.continuar);
  });
};  

module.exports = jsonWebToken;