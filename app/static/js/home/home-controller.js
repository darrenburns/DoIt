angular.module('todolist')
    .controller('HomeController',
    ['$scope', 'TodoItem',
        'TodoListService', 'TagService',
        function ($scope, TodoItem, TodoListService, TagService) {

            $scope.newTodoText = '';
            $scope.newTodoTags = [];

            $scope.addTodo = function() {
                TodoListService.addTodo($scope.newTodoText, $scope.newTodoTags);
                $scope.newTodoText = '';
                $scope.newTodoTags = [];
            };

            $scope.todos = TodoListService.getTodos();
            $scope.allTags = TagService.getAllTags();
            $scope.selectedTags = TagService.getAllSelectedTags();

            $scope.selectAllTags = TagService.selectAllTags;
            $scope.deselectAllTags = TagService.deselectAllTags;
            $scope.toggleSelectTag = TagService.toggleSelectTag;

    }]);
