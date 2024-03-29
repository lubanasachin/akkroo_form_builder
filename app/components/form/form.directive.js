'use strict';
/**
 * @ngdoc function
 * @name formAdminApp.controller:formDirective
 * @description
 * # MainCtrl
 * Directive of the formAdminApp
 */
angular.module('formAdminApp')
  .directive('myElement',['formService',function(formService) {

        return {
            restrict: 'E',
            transclude: true,
            scope: true,
            link: function($scope, element,attrs) {

				$scope.field = formService.setDefaultProperties(attrs.elementType);
				$scope.field.allEvents = formService.allEvents;
				$scope.field.allActions = formService.allActions;

                /**
                * remove element
                * @params
                */
                $scope.removeMe = function() {
					formService.removeComponent($scope,element);
                }

                /**
                * add select/radio options
                * @params
                */
                $scope.addOptions = function() {
					formService.addRadioOptions($scope);
                }

                /**
                * add events
                * @params
                */
				$scope.addEvents = function() {
					formService.addEvents($scope);
				}

                /**
                * watch scope variables
                * @params
                */
                $scope.$watch('field', function(newVal,oldVal) {
                    if($scope.field.fieldId === undefined) return;
					formService.modifyFormJson(newVal);
                },true);

            },
            templateUrl: function(element,attrs) {
				return 'app/components/form/views/my-'+attrs.elementType+'.html';
			}
        }
}]);
