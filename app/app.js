'use strict';
/**
* @ngdoc overview
* @name formAdminApp
* @description
* # formAdminApp
*
* Main module of the application.
*/

angular
  .module('formAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap'
  ])
  .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {

    $ocLazyLoadProvider.config({
    debug:false,
    events:true,
    });

    $urlRouterProvider.otherwise('/form');

    $stateProvider
    .state('form',{
      url:'/form',
      controller: 'formCtrl',
      templateUrl:'app/components/form/views/form.view.html',
      resolve: {
        loadMyFiles:function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name:'formAdminApp',
            files:[
              'app/components/form/form.controller.js',
              'app/components/form/form.service.js',
              'app/components/form/form.directive.js'
            ]
          })
        }
      }
    })
  }]);


