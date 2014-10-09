angular.module('todolist')
    .controller('HomeController', ['$scope', 'TodoItem', function ($scope, TodoItem) {

        $scope.todos = [];

        $scope.newTodoText = '';
        $scope.newTodoTags = [];

        // Load all tags for the current user.
        $scope.allTags = [];

        $scope.addTodo = function () {

            // Create a new item
            var item = new TodoItem($scope.newTodoText, $scope.newTodoTags, false);

            // Add it to the list of todos
            if ($scope.newTodoText.length > 1) {
                $scope.todos.push(item);

                if ($scope.allTags.length == 0) {
                    $scope.allTags = $scope.allTags.concat(item.tags);
                } else {
                    // for each new tag
                    for (var i = 0; i < $scope.newTodoTags.length; i++) {
                        var newTag = $scope.newTodoTags[i];
                        var found = false;
                        for (var j = 0; j < $scope.allTags.length; j++) {
                            if (newTag.text == $scope.allTags[j].text) {
                                found = true; // it's already here, move on to the next new tag
                                break;
                            }
                        }

                        if (!found) {
                            $scope.allTags.push(newTag);
                        }
                    }
                    // check if the tag currently exists


                }

            }

            $scope.newTodoText = '';
            $scope.newTodoTags = [];

        };


    }]);
