// Declare app level module which depends on filters, and services
angular.module('todolist', ['ngResource', 'ngRoute', 'ngAnimate',
    'ui.bootstrap', 'ngTagsInput', 'timer'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home/home.html',
                controller: 'HomeController'})
            .when('/stats', {
                templateUrl: 'views/stats/stats.html',
                controller: 'StatsController'
            })
            .otherwise({redirectTo: '/'});
    }]);
