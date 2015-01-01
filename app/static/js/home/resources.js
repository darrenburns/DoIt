var module = angular.module('todolist');

var BASE_API_URL = 'api/';

module.factory('Api', ['$resource',
    function($resource) {
        return {
            Todo: $resource(BASE_API_URL + 'todo/:id', {id: '@id'}),
            Tag: $resource(BASE_API_URL + 'tag/:id', {id: '@id'})
        }
}]);