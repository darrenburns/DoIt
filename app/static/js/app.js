// Declare app level module which depends on filters, and services
angular.module('todolist', ['ngResource', 'ngRoute', 'ngAnimate', 'ngSanitize',
    'ui.bootstrap', 'ngTagsInput', 'timer', 'btford.markdown'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home/home.html',
                controller: 'HomeController'
            })
            .when('/stats', {
                templateUrl: 'views/stats/stats.html',
                controller: 'StatsController'
            })
            .when('/todo/:todoId', {
                templateUrl: 'views/todo/todo.html',
                controller: 'TodoController'
            })
            .otherwise({redirectTo: '/'});
    }]);
