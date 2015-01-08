var module = angular.module('todolist');

var BASE_API_URL = 'api/';

module.factory('Api', ['$resource',
    function($resource) {
        return {
            Todo: $resource(BASE_API_URL + 'todo/:id', {id: '@id'},
                {
                    'query': {method: 'GET', isArray: false}
                }
            ),
            Tag: $resource(BASE_API_URL + 'tag/:id', {id: '@id'},
                {
                    'query': {method: 'GET', isArray: false}
                }
            ),
            Pomodoro: $resource(BASE_API_URL + 'pomodoro/:id', {id: '@id'},
                {
                    'query': {method: 'GET', isArray: false}
                }
            ),
            User: $resource(BASE_API_URL + 'user/:id', {},
                {
                    'query': {method: 'GET', isArray: false}
                }
            )
        }

}]);