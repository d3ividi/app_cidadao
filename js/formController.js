/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
app.controller('formController',function($rootScope,$scope,googleSheet,util,$routeParams,dialogs,config){
    $scope.lmto = {};
    $scope.params = {};
    
	
	function formataData(data){

		var dia = data.getDate();
		if (dia.toString().length == 1)
		  dia = "0"+dia;
		var mes = data.getMonth()+1;
		if (mes.toString().length == 1)
		  mes = "0"+mes;
		var ano = data.getFullYear();  
		return dia+"/"+mes+"/"+ano;
	}
	
	showError = function(message){

        $scope.spinerloading = false;
        if(!$scope.showErrorOpen){
            var dlg = dialogs.error('Erro','Ocorreu um erro inesperado! Tente novamente mais tarde, se o problema persistir entre em contato com o suporte e informe o erro.<br/><br/>Erro: '+message);
            $scope.showErrorOpen = true;
            dlg.result.then(function(btn){
                 $scope.showErrorOpen = false;
            });
        }
        $rootScope.$broadcast('dialogs.wait.complete');
        return false;
    }; 
	
	
    $scope.params.bairros = [
       'TABOLEIRO',
       'MONTE ALEGRE',
       'CONDE VILA VERDE',
       'VARZEA DO RANCHINHO',
       'AREIAS',
       'SANTA REGINA',
       'CEDRO',
       'RIO PEQUENO',
       'BRAÇO',
       'RIO DO MEIO',
       'CENTRO',
       'JOÃO DA COSTA',
       'SÃO FRANCISCO DE ASSIS',
       'VILA CONCEIÇÃO'
    ];
    
    $scope.params.cidades = [
        'CAMBORIÚ',
        'BALNEÁRIO CAMBORIÚ'
    ];
    
    $scope.params.estadoCivil = [
        'SOLTEIRO(A)',
        'CASADO(A)',
        'UNIÃO ESTÁVEL',
        'SEPARADO(A)',
        'VIÚVO(A)'
    ];
    
    $scope.cidade = 'CAMBORIÚ';
    

    
    $scope.enviar = function(){
        
        $scope.transaction = {};
        $rootScope.loading = true;

        googleSheet.setSpreadSheetId(config.idSheet);
        googleSheet.setSheetName("Pessoa");
        $scope.lmto.usuario = $rootScope.usuario;
        $scope.lmto.dataNascimento = formataData($scope.lmto.dataNascimento);
        googleSheet.insertRecord($scope.lmto,function(data){
           $rootScope.loading = false;
           $scope.transaction.status = data.status;
           $scope.transaction.message = data.message;
           if(data.status){
                $scope.lmto = {};

           }else{
               $scope.transaction.message = "Erro Inesperado! "+data.message;
           }
           $scope.$apply();
           
        });
    };
            
     function checkAutorizado(){
        console.log(googleSheet.autorizado);
        if(!googleSheet.autorizado){
            setTimeout(checkAutorizado, 1000);
        }else{
            googleSheet.getUser(function(result){
                
                if(!result.status)
                    return showError(result.message);
                $rootScope.loading = false;
                $rootScope.usuario = result.data;
                $scope.$apply();
            });
        }
    }
    
    
    function checkLoadGapi(){
        $rootScope.loading = true;
        if (!gapi.client) {
            console.log("Esperando Gapi");
            setTimeout(checkLoadGapi, 1000); // Espera por 2 segundo
        }else{
            googleSheet.checkAuth();
            checkAutorizado();
        }
    }
    
    checkLoadGapi();
    
});

