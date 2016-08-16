'use strict';

/*******************************************************************
 * Listificando é de (C) propriedade da Devowly Sistemas 2015-2016 *
 *                 https://github.com/devowly                      *
 *******************************************************************
 * 
 * $Id preencher.js, criado em 10/08/2016 às 16:35 por Leo Felippe $
 *
 * Versão atual 0.0.1-Beta
 */

/* Realizará o preenchimento dos dados para um banco de dados qualquer.
 * @Veja https://github.com/umdez/preenchedor/blob/master/README.md
 */

var Preenchedor = require('preenchedor');
var aConfiguracaoPadrao = require('./configuracao/configuracao.js');
var modelos = require('./modelos/indice');
var dados = require('./dados/indice');

var preenchedor = new Preenchedor(aConfiguracaoPadrao, dados, modelos);

preenchedor.conectarAoBanco( function() {
  // Carregamos aqui os dados.
  preenchedor.armazenarOsDados();
});