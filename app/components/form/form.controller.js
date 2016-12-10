'use strict';
/**
 * @ngdoc function
 * @name formAdminApp.controller:formCtrl
 * @description
 * # formCtrl
 * Controller of the formAdminApp
 */
angular.module('formAdminApp')
  .controller('formCtrl',['$scope','formService', function($scope,formService) {

		$scope.showMe = 'design';
		$scope.previousBtn = false;

		$scope.addNewComponent = function(addMe) {
			formService.addNewComponent($scope,addMe);
		}

		$scope.addNewForm = function() {
			formService.addNewForm($scope);
		}

		$scope.showPreviousForm = function() {
			formService.showPreviousForm($scope);
		}

		$scope.saveForm = function() {
			formService.saveForm($scope);
		}

		$scope.submitForm = function() {
			formService.submitForm($scope);
		}

		$scope.resetForm = function() {
			formService.resetForm();
		}

		$scope.showView = function(showme) {
			$scope.showMe = showme;
			if(showme === 'preview') formService.previewForm();
		}

		$scope.addNewForm();
}]);
