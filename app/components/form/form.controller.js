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

	    /**
	    * add new component
	    * @params
	    */
		$scope.addNewComponent = function(addMe) {
			formService.addNewComponent($scope,addMe);
		}

	    /**
	    * add new form
	    * @params
	    */
		$scope.addNewForm = function() {
			formService.addNewForm($scope);
		}

	    /**
	    * show previous form
	    * @params
	    */
		$scope.showPreviousForm = function() {
			formService.showPreviousForm($scope);
		}

	    /**
	    * save current form
	    * @params
	    */
		$scope.saveForm = function() {
			formService.saveForm($scope);
		}


	    /**
	    * submit finish form
	    * @params
	    */
		$scope.submitForm = function() {
			formService.submitForm($scope);
		}

	    /**
	    * reset current form
	    * @params
	    */
		$scope.resetForm = function() {
			formService.resetForm();
		}

	    /**
	    * show calltoactions
	    * @params
	    */
		$scope.showView = function(showme) {
			$scope.showMe = showme;
			if(showme === 'preview') formService.previewForm();
		}

		$scope.addNewForm();
}]);
