// Declare app level module which depends on filters, and services
angular.module('todolist', ['ngResource', 'ngRoute', 'ui.bootstrap', 'ngTagsInput'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home/home.html',
                controller: 'HomeController'})
            .otherwise({redirectTo: '/'});
    }]);
