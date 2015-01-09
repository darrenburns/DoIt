// Declare app level module which depends on filters, and services
angular.module('todolist', ['ngResource', 'ngAnimate', 'ngSanitize',
    'ui.bootstrap', 'ngTagsInput', 'timer', 'btford.markdown', 'satellizer', 'ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', '$authProvider',
        function ($stateProvider, $urlRouterProvider, $authProvider) {

            var checkAuth = function($q, $location, $auth) {
                var deferred = $q.defer();

                if (!$auth.isAuthenticated()) {
                    $location.path('/login');
                } else {
                    deferred.resolve();
                }

                return deferred.promise;
            };

            $stateProvider
                .state('home', {
                    url: '/home/:tag?',
                    templateUrl: 'views/home/home.html',
                    controller: 'HomeController',
                    resolve: {
                        authenticated: checkAuth
                    }
                })
                .state('stats', {
                    url: '/stats',
                    templateUrl: 'views/stats/stats.html',
                    controller: 'StatsController',
                    resolve: {
                        authenticated: checkAuth
                    }
                })
                .state('todo', {
                    url: '/todo/:todoId',
                    templateUrl: 'views/todo/todo.html',
                    controller: 'TodoController',
                    resolve: {
                        authenticated: checkAuth
                    }
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/users/login.html',
                    controller: 'LoginController'
                })
                .state('logout', {
                    url: '/logout',
                    templateUrl: null,
                    controller: 'LogoutController'
                });

            $urlRouterProvider.otherwise('/home/');

            $authProvider.google({
                clientId: '158496852023-7gfibupmaqnjlk80uc805cd2og07fdog.apps.googleusercontent.com',
                redirectUri: window.location.origin  + '/auth/google' ||
                window.location.protocol + '//' + window.location.host + '/auth/google'
            });

        }]);
