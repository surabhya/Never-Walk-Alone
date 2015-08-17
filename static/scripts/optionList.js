var app = angular.module('option-list', ['ngSanitize']);
app.directive('optionList', function(){
	return{
		restrict: 'E',
		templateUrl: '../../templates/optionList.html',
		controller: function($scope){
			$scope.toggleSelection = function (option) {
    			var idx = $scope.location.userSelection.indexOf(option);
     			if (idx > -1) {
      				$scope.location.userSelection.splice(idx, 1);
     			}else {
      				$scope.location.userSelection.push(option);
     			}
   			};
   		$scope.reset = function(){
   				$scope.location.userSelection=[]; 
   		}; 
      $scope.userFriendly = function(word){
        while(word.indexOf('_') >= 0){
          word = word.replace('_',' ')
        }
        return word;
      }  
    }
	}
});
