'use strict';

/* @arquivo Usuarios.js */

var uuid = require('node-uuid');
var bcrypt = require('bcrypt-nodejs');

module.exports = function (database, DataTypes) {

  var VERSAO_BANCO_DADOS = 1;

  var Usuarios = database.define('Usuarios', {

    nome: { type: DataTypes.STRING, validate: {} },  // Nome do nosso usuário

    jid: { type: DataTypes.STRING, unique: true, validate: {} },  // JID do usuário.

    uuid: { type: DataTypes.UUID, unique: true, defaultValue: uuid.v4, validate: { isUUID: 4 } },  // Identificador unico deste usuário.
    
    senha: { type: DataTypes.STRING, validate: {} }  // A senha do usuário. 
  }, {

    associar: function (modelos) {
      modelos.Usuarios.hasOne(modelos.Funcoes, { foreignKey: 'usuario_id' });
    },
    
    instanceMethods: {
      verificarSenha: function(senha) {
        // Verificamos a senha de forma sincrona. Retorna true se cofere com a
        // nossa senha.
        return bcrypt.compareSync(senha, this.senha);
      }
    }
  });

  return {
    mod: Usuarios
  , versao: VERSAO_BANCO_DADOS
  };
};