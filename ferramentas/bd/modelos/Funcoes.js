'use strict';

/* @arquivo Funcoes.js */

module.exports = function (database, DataTypes) {

  var VERSAO_BANCO_DADOS = 1;

  var Funcoes = database.define('Funcoes', {
    
    id: { type: DataTypes.INTEGER, autoIncrement: true,  primaryKey: true },

    bandeira: { type: DataTypes.STRING, validate: {} }  
  }, {

    associar: function (modelos) {
      modelos.Funcoes.belongsTo(modelos.Usuarios, { foreignKey: 'usuario_id' });  
    },
    
    instanceMethods: {
      
    }
  });

  return {
    mod: Funcoes
  , versao: VERSAO_BANCO_DADOS
  };
};