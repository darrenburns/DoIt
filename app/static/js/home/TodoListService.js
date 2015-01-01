module = angular.module('todolist');

module.factory('TodoListService',
    ['TodoItem', 'TagService', 'Api',
        function (TodoItem, TagService, Api) {

            // State here
            var todos = Api.Todo.get();

            return {

                getTodos: function () {
                    return todos;
                },

                getTagsAsStrings: function (todo) {
                    var tagStringList = [];
                    for (var tagIdx = 0; tagIdx < todo.tags.length; tagIdx++) {
                        tagStringList.push(todo.tags[tagIdx].text);
                    }
                    return tagStringList;
                },

                removeTodo: function (todoId) {
                    return null;
                },

                editTodo: function (todoId) {
                    return null;
                }
            }

        }]);