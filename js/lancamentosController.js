app.controller('lancamentos',function($rootScope,$scope,googleSheet,config){
    $rootScope.loading = false;
    $scope.resumo = {};
    
    $scope.getLancamentos = function(){
			console.log("Entrei aqui também");
      googleSheet.setSpreadSheetId(config.idSheet);
      googleSheet.setSheetName(config.sheetDados);
      googleSheet.getAllRecords('associativeArray',function(data){
          console.log(data);
          $scope.resumo.lancamentos = data.data.splice(data.length-50,50);
          $rootScope.lancamentos = $scope.resumo.lancamentos;
          $rootScope.loading = false;
          $scope.$apply();
		  
      });
    }; 
    
    $scope.getLancamentos();
	console.log("Entrei aqui");
    
});