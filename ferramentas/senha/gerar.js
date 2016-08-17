/* Uma ferramenta para gerar senhas.
 *
 * @Arquivo gerar.js
 */

var bcrypt = require('bcrypt-nodejs');

var senha = "montes"
  
bcrypt.genSalt(5, function(erro, salt) {
  if (erro) {
    console.log('Erro ao tentar gerar o salt. Encerrando o processo.');
    process.exit(1);
  }
  bcrypt.hash(senha, salt, null, function(erro, hash) {
    if (erro) {
      console.log('Erro ao tentar gerar a senha. Encerrando o processo.');
      process.exit(1);
    }
    console.log('A senha ['+ senha +'] é equivalente a: '+ hash);
  });
});
