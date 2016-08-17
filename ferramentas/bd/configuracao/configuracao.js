/* Exporta objeto contendo os dados de configuração.
 *
 * @Arquivo configuracao.js
 */

var configuracao = {};

/* @Diretiva {armazenamento} O nosso sistema de armazenamento. 
 * 
 * - armazenamento.dialeto (Obrigatório) O dialeto usado. Podendo ser: mysql,
 * postgres ou então sqlite.
 *
 * - armazenamento.porta (Opcional e Recomendado) A porta utilizada para conexão
 * com o nosso banco de dados. Exeto para o SQlite.
 *
 * - armazenamento.endereco (Opcional e Recomendado) O endereço do nosso banco
 * de dados. Exeto para o SQlite.
 *
 * - armazenamento.senha (Obrigatório) A nossa senha de conexão com o banco.
 * Exeto para o SQlite.
 *
 * - armazenamento.database (Obrigatório) O nome do banco utilizado.
 *
 * - armazenamento.usuario  (Obrigatório) O nome do usuário do banco. Exceto
 * para o SQLite.
 * 
 * - armazenamento.seForForcarCriacaoDeNovasTabelas (Opcional) Realiza a remoção
 * das tabelas existentes e as cria novamente.
 */
configuracao.armazenamento = {
  "usuario": "leo"                  
, "senha": "montes"                 
, "database": "database"  
, "seForForcarCriacaoDeNovasTabelas": false                
};

module.exports = configuracao;