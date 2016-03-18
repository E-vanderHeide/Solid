 angular.module('app.headerModule', [])
	.directive('header', function () {
	    return {
	        restrict: 'E',
	        replace: true,
	        scope: {},
	        templateUrl: "app/shared/header/headerView.html",
	        controller: ['$scope', '$filter', function ($scope, $filter) {
	            
	        }]
	    }
	})