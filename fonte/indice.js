'use strict';

// Utilizado para facilitar o acesso aos módulos deste sitemas para cada um dos nossos módulos.
module.exports = {
  ServicoRest: require('./servicoRest/indice'),      // Nosso modulo do serviço REST.
  Armazenamento: require('./armazenamento/indice'),  // Nosso módulo de armazenamento.
  Autenticacao: require('./autenticacao/indice'),    // Nosso módulo de autenticacao.
  registrador: require('./nucleo/registrador'),      // Realizar o registro.
  jwt: require('./nucleo/jwt')                       // Suporte para o Json Web Token.
};