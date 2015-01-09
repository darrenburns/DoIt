var module = angular.module('todolist');

/*
Controller for the to-do screens
 */
module.controller('TodoController', ['$scope', '$stateParams', 'Api', 'Account',
    function($scope, $stateParams, Api, Account) {

        Account.getProfile().success(function(user) {
            $scope.user = user;
            Api.Todo.query({user_id:user.id} , function(todos) {
                console.log(todos);
            });
            $scope.todo = Api.Todo.get({id: $stateParams.todoId})
        });



}]);