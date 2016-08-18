/* Exporta objeto contendo os dados de configuração para o nosso servidor.
 *
 * @Arquivo configuracao.js
 */

var config = {};

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
config.armazenamento = {
  "dialeto": "mysql"                
, "usuario": "leo"                  
, "senha": "montes"                 
, "database": "database"            
, "maxDeConsultasConcorrentes": 200 
, "maxDeConexoes": 1                
, "maxTempInativo": 30              
, "endereco": "127.0.0.1"           
, "porta": 3306      
, "seForForcarCriacaoDeNovasTabelas": false                
};

/* @Diretiva {servidor} O nosso servidor http.
 * 
 * - servidor.porta (Obrigatório) A porta onde o serviço irá esperar por
 * requisições http.
 *  
 * - servidor.portaSSL (Obrigatório) A porta ao qual o servidor irá esperar por
 * requisições https.
 *
 * - servidor.limite (Obrigatório) Valor limite do body que é permitido.
 * Mantenha o valor baixo para precaver contra negação de serviços.
 *
 * - servidor.exigirConSegura (Obrigatório) Se for necessário obrigar uma
 * conexão segura.
 *
 * - servidor.cors (Opcional) Se iremos oferecer o serviço cors.
 *
 * - servidor.certificados (Obrigatório) Os nossos certificados para o https.
 * 
 * - servidor.registro (Opcional) Formatos de registro do morgan. podendo ser:
 * 'default', 'short', 'tiny', 'dev', 'combined' etc.
 */
config.servidor = {
  "registro": "combined"  
, "porta": 80             
, "portaSSL": 443         
, "limite": "200kb"        
, "exigirConSegura": true 
, "cors": null
, "certificados": null
};

/* @Diretiva {servidor.cors} O nosso serviço Cors.
 *
 * - servidor.cors.origem (Obrigatório) O endereço de origem que é permitidos
 * pelo cors. Por questões de segurança, utilize *apenas* para a fase de
 * desenvolvimento e testes.
 *
 * - servidor.cors.metodos (Obrigatório) Os métodos de requisição aceitos. 
 *
 * - servidor.cors.cabecalhosAceitos (Obrigatório) Os cabeçalhos aceitos.
 *
 * - servidor.cors.cabecalhosExpostos (Obrigatório) Aqui teremos os cabeçalhos
 * *expostos* para as requisições ao servidor HTTP. @Veja http://stackoverflow.com/a/15444439/4187180
 * 
 *  - servidor.cors.seUsarCredenciais (Obrigatório)
 */
config.servidor.cors = {                         
  "origem": ["http://localhost", "https://localhost"]
, "metodos": ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS']  
, "cabecalhosAceitos": ['Content-Range', 'X-total', 'Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Date', 'X-Api-Version', 'X-Limitador-Limite', 'X-Limitador-Restante', 'x-acesso-token', 'x-autenticacao-jid']
, "cabecalhosExpostos": ['Content-Range', 'X-total', 'X-Limitador-Limite', 'X-Limitador-Restante', 'x-acesso-token', 'x-autenticacao-jid']
, "seUsarCredenciais": true
};

/* @Diretiva {servidor.certificados} As nossas chaves privadas e certificados
 * para https. Foi utilizado uma ferramenta openssl provida pelo git. O comando
 * completo para gera-los é:
 * 
 * openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout chaveprivada.key -out certificado.crt 
 *
 * Para mais informações. @Veja http://stackoverflow.com/a/21180554
 * 
 * - servidor.certificados.chavePrivada (Obrigatório) A chave privada.
 *
 * - servidor.certificados.certificado (Obrigatório) O certificado.
 */
config.servidor.certificados = {
  "chavePrivada": "servidorHttps.key" 
, "certificado": "servidorHttps.crt"   
};

/* @Diretiva {servidorRest} O nosso servidor Restificando.
 *
 * - servidorRest.base (Opcional) A nossa base do serviço restificando.
 */
config.servidorRest = {
  "base": ""
};

module.exports = config;