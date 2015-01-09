var module = angular.module('todolist');

var BASE_API_URL = 'api/';

module.factory('Api', ['$resource',
    function($resource) {
        return {
            Todo: $resource(BASE_API_URL + 'todo/:id', {},
                {
                    'query': {method: 'GET', isArray: false},
                    'update': {method: 'PUT', params: {id: '@id'}}
                }
            ),
            Tag: $resource(BASE_API_URL + 'tag/:id', {},
                {
                    'query': {method: 'GET', isArray: false}
                }
            ),
            Pomodoro: $resource(BASE_API_URL + 'pomodoro/:id', {},
                {
                    'query': {method: 'GET', isArray: false}
                }
            ),
            User: $resource(BASE_API_URL + 'user/:id', {},
                {
                    'query': {method: 'GET', isArray: false},
                    'update': {method: 'PUT', params: {id: '@id'}}
                }
            )
        }

}]);