var user;
 angular.module('app.homeModule', [])

.controller('homeController', function($scope, $http) {
		id = "56bf106736c95e0876ccea3a";
		$http.get("http://kommoncare.davidmr.es/api/users/" +id)
	    .then(function(response) {
	    	user = response.data;
	    	 $scope.user = user;
	    });
       
       
    });