var module = angular.module('todolist');

module.controller('TodoController', ['$scope', '$stateParams', 'Api',
    function($scope, $stateParams, Api) {


        $scope.todo = Api.Todo.get({id: $stateParams.todoId});

        $scope.deleteTodo = function(todo) {
            todo.deleted = true;
            todo.$save();
        };




}]);