/**
 * Módulo GoogleSheet
 * 
 * Criado para ser utilizado com o framework AngularJs,
 * Possibilita a manipulação dos dados de uma planilha no Google através de uma API Google Apps Script
 * 
 * Métodos disponíveis:
 * 
 * setSpreadSheetId -> Seta o id da planilha a ser manipulada
 * setSheetName -> Seta o nome da página a ser manipulada
 * insertRecord -> Permite inserir um novo registro na planilha
 * updateRecord -> Permite atualizar um registro existente na planilha
 * removeRecord -> Permite remover um registro da planilha
 * getRecord -> Permite resgatar um registro da planilha
 * getAllRecords -> Permite resgatar todos os registros da planilha
 * getColumnData -> Permite resgatar todos os dados de uma coluna da planilha
 * 
 * Considerações:
 * -> Cada método possui a sua documenteção detalhada
 * -> A api é executada com usuário sistema@moontools.com.br
 * 
 */

(function(){
    angular.module('mtl.googleSheet',[])
    
    // Constantes de configuração
    .constant('configGoogleSheet',{
        
        // Configuração das Urls
        CLIENT_ID : '62312602361-lpt4k0e7299vehvfkkgdho4e3ji2sh35.apps.googleusercontent.com',
        SCOPES : ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/script.storage','https://www.googleapis.com/auth/userinfo.email'],
        SCRIPT_ID : "MtzKFRqkFKWGYNuTL-8nG4BhIx6W92rkw" 
    })
    
    /*
     * Factory Google Sheet
     * @param {object} $http Objeto para conexão com Backend 
     * @param {object} configGoogleSheet Objeto com configurações
     * @returns {object} Retorna o objeto GoogleSheet
     */
    .factory('googleSheet',function($http,configGoogleSheet,dialogs){
        
        var googleSheet = {};
        googleSheet["id"] = null;
        googleSheet["sheetName"] = null;
        googleSheet["autorizado"] = false;
        var devMode = false;
        
        
        /**
        * Verifica se o usuário autorizou a aplicação.
        */
        googleSheet.checkAuth = function() {

            console.log("Entrei o checkAuth");

                gapi.auth.authorize(
                    {
                      'client_id': configGoogleSheet.CLIENT_ID,
                      'scope': configGoogleSheet.SCOPES.join(' '),
                      'immediate': true
                    }, googleSheet.handleAuthResult);
            
        };
        
        
        /**
        * função executada ao receber resposta do servidor de autorização
        *
        * @param {Object} authResult Authorization result.
        */
        googleSheet.handleAuthResult = function(authResult) {
            console.log("entrei no handleAuthResult");
            if (authResult && !authResult.error) {
              console.log("Autorizado");
              googleSheet.autorizado = true;
            } else {
                console.log("Não Autorizado");
                var message = '<div id="authorize-div" style="display: none">';
                    message += '<span>Para utilizar este formulário você deve permitir acesso as suas planilhas do Google! Deseja continuar?</span>';
                    
                dialogs.notify("Atenção",message)
                .result.then(function(){
                    console.log("Entrei no then")
                    googleSheet.handleAuthClick();
                });    
            }
        };
        
        
        /**
        * Initiate auth flow in response to user clicking authorize button.
        *
        * @param {Event} event Button click event.
        */
        googleSheet.handleAuthClick = function() {
            console.log("handleAuthClick");
            gapi.auth.authorize(
              {client_id: configGoogleSheet.CLIENT_ID, scope: configGoogleSheet.SCOPES, immediate: false},
              googleSheet.handleAuthResult);
            return false;
        };
        
        googleSheet.getUser = function(callback){
            var request = {
                'function' :"getUser",
                'devMode': devMode,
                'parameters':[]
            };
            googleSheet.request(request,callback);
        };

        /**
         * Seta o Id da planilha a ser manipulada pela API
         * @param {string} spreadSheetId Id da planilha do Google
         */
        googleSheet.setSpreadSheetId = function(spreadSheetId){
            googleSheet.id = spreadSheetId;
        };


        /**
         * Seta o nome da página a ser manipulada pela API
         * @param {string} sheetName Nome página
         */
        googleSheet.setSheetName = function(sheetName){
            googleSheet.sheetName = sheetName;
        };


        /**
         * Configura o url com algums parâmetros defaults
         */
        googleSheet.configParamsDefaults = function(){

        };


        /**
         * Insere um novo registro na planilha
         * @param {object} record Objeto com os dados a serem inseridos
         * @param {function} callback Função a ser executada ao fim da requisição
         */
        googleSheet.insertRecord = function(record, callback){
            var request = {
                'function' :"insertRecord",
                'devMode': devMode,
                'parameters':[googleSheet.id,googleSheet.sheetName,record]
            };
            googleSheet.request(request,callback);
        };


        /**
         * Remove um registro da planilha
         * @param {string} column Coluna a ser pesquisada para encontrar o registro
         *                 EX: "linha","Código" ou pelo Cabeçalho de preferência
         * @param {string} value Valor a ser procurado
         * @param {function} callback Função a ser executada ao fim da requisição 
         */
        googleSheet.removeRecord = function(type,value,callback){
 
        };


        /**
         * Atualiza um registro da planilha
         * @param {object} record Dados a serem atualizados
         * @param {string} column Coluna a ser pesquisada para encontrar o registro
         *                 EX: "linha","Código" ou pelo Cabeçalho de preferência
         * @param {string} value Valor a ser procurado
         * @param {string} sheetNameBackup Nome da página a ser feito o backup do registro
         *                 Obs: Passar null se não deseja fazer backup   
         * @param {function} callback Função a ser executada ao fim da requisição
         */
        googleSheet.updateRecord = function(record, column, value, sheetNameBackup, callback){

        };
        
        
        /**
         * Retorna um registro da planilha
         * @param {string} column Coluna a ser pesquisada
         *                 EX: "linha","Código" ou pelo Cabeçalho de preferência
         * @param {string} value Valor a ser procurado
         * @param {function} callback Função a ser executada ao fim da requisição
         */
        googleSheet.getRecord = function(column, value, callback){

        };

        /**
         * Retorna todos os registros da planilha
         * @param {string} returnType Tipo do retorno esperado
         *                 Ex: "arrayAssociative" -> Para obter o retorno no formato de um array associativo
         *                 Ex: "array" -> Para objer o retorno no formato de um array normal
         * @param {function} callback Função a ser executada ao fim da requisição
         */
        googleSheet.getAllRecords = function(returnType, callback){

        };

        /**
         * Retorna todos os dados das colunas informadas
         * @param {array} columns Array com os nomes das colunas desejadas 
         *                  Obs: o nome da coluna deve esta no formato de cabeçalhos normalizados Ex: "Nome Pessoa" -> "nomePessoa"
         */
        googleSheet.getColumnData = function(columns,returnType, callback){         
           var request = {
                'function' :"getColumnData",
                'devMode': devMode,
                'parameters':[googleSheet.id,googleSheet.sheetName,[columns],returnType]
            };
            googleSheet.request(request,callback);
        };


        /**
         * Executa requisição para API do AppScript
         * @param {object} params Parâmetros que serão enviados para API
         * @param {function} callback Função
         */
        googleSheet.request = function(params,callback){
            var request = gapi.client.request({
                'root': 'https://script.googleapis.com',
                'path': 'v1/scripts/' + configGoogleSheet.SCRIPT_ID + ':run',
                'method': 'POST',
                'body': params
            });
            
            request.execute(function(result){
                if(result.error && result.error.status){
                    callback({status:false, data:null, message: result.error.message})
                }else{
                    var result = result.response.result;
                    callback(result);
                }
            });
        };
        return googleSheet;

    });

})();

