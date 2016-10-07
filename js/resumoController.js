app.controller('resumo',function($rootScope, $scope, googleSheet, $filter, config, dialogs){
    //$rootScope.loading = true;
    
    
    
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
     
    
    
    $scope.resumo = {};
    $scope.data = new Date();
    $scope.meses = {
        1:'Janeiro',
        2:'Fevereiro',
        3:'Março',
        4:'Abril',
        5:'Maio',
        6:'Junho',
        7:'Julho',
        8:'Agosto',
        9:'Setembro',
        10:'Outubro',
        11:'Novembro',
        12:'Dezembro'
    };
    $scope.anos = [
        2010,   
        2011,
        2012,
        2013,
        2014,
        2015,
		2016,
		2017
    ];
    
    
    $scope.getData = function(){
        $rootScope.loading = true;
        googleSheet.setSpreadSheetId(config.idSheet);
        googleSheet.setSheetName(config.sheetResumo);
        googleSheet.getColumnData(['mesEAno','entrada','saida'],'associativeArray',function(data){
            console.log(data);
            if(!data.status){
                return showError(data.message);
            }
            $scope.resumo.dados = data.data;
            $scope.updateResumo();
            $scope.$apply();
        });
    };
    
    $scope.updateResumo = function(){
        $scope.mes = $scope.data.getMonth()+1;
        $scope.ano = $scope.data.getFullYear();
        if(!$scope.resumo.dados){
            $scope.getData();
        }else{
            $scope.resumo.entrada = 0;
            $scope.resumo.saida = 0;
            $scope.resumo.saldo = 0;
            var itens = $scope.resumo.dados;
            for(var i in itens){
                if(itens[i].mesEAno === $scope.mes+","+$scope.ano){
                     $scope.resumo.entrada = itens[i].entrada;
                     $scope.resumo.saida = itens[i].saida;
                     $scope.resumo.saldo = itens[i].entrada - itens[i].saida;
                     $rootScope.loading = false;
                     break;
                }
            }
        }
    };
    
    $scope.updateMonth = function(next){
        var lastDay = new Date($scope.data.getFullYear(), $scope.data.getMonth() + 1, 0);
        lastDay = $filter('date')(lastDay,'dd');       
        $scope.data.setDate(next ? $scope.data.getDate() + parseInt(lastDay) : $scope.data.getDate() - parseInt(lastDay));
        $scope.updateResumo();
    };
    
    
    
    function checkAutorizado(){
        console.log(googleSheet.autorizado);
        if(!googleSheet.autorizado){
            setTimeout(checkAutorizado, 1000);
        }else{
            googleSheet.getUser(function(result){
                console.log(result);
                if(!result.status)
                    return showError(result.message);
                $scope.spinerloading = false;
                $scope.$apply();
                $scope.updateResumo();
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