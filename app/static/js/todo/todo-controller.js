var module = angular.module('todolist');

module.controller('TodoController', ['$scope', '$routeParams', 'Api',
    function($scope, $routeParams, Api) {

        $scope.todo = Api.Todo.get({id: $routeParams.todoId});

        $scope.deleteTodo = function(todo) {
            todo.deleted = true;
            todo.$save();
        };




}]);