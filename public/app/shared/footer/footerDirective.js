 angular.module('app.footerModule', [])
	.directive('footer', function () {
	    return {
	        restrict: 'E',
	        replace: true,
	        scope: {},
	        templateUrl: "app/shared/footer/footerView.html",
	        controller: ['$scope', '$filter', function ($scope, $filter) {
	            
	        }]
	    }
	})