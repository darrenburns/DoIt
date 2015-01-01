var module = angular.module('todolist');

var BASE_API_URL = 'api/';

module.factory('Api', ['$resource',
    function($resource) {
        return {
            Todo: $resource(BASE_API_URL + 'todo/:id', {id: '@id'},
                {
                    'query': {method: 'GET', isArray: false},
                    'update': {method: 'PUT'}
                }
            ),
            Tag: $resource(BASE_API_URL + 'tag/:id', {id: '@id'},
                {
                    'query': {method: 'GET', isArray: false}
                }
            )
        }
}]);