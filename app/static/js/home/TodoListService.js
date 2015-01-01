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

                addTodo: function (text, tags) {

                    // Create a new item
                    var todo = new Api.Todo({text:text, tags:tags, done:false});

                    if (text.length > 1) {
                        todo.$save;

                        // Add all of the tags from the new item
                        if (TagService.getAllTags().length == 0) {
                            TagService.addAllTags(todo)
                            TagService.selectAllTags();
                        } else {  // Prevent duplicate tags
                            for (var i = 0; i < tags.length; i++) {
                                var newTag = tags[i];
                                var found = false;
                                for (var j = 0; j < TagService.getAllTags().length; j++) {
                                    if (newTag.text == TagService.getAllTags()[j].text) {
                                        found = true; // it's already here, move on to the next new tag
                                        break;
                                    }
                                }

                                if (!found) {
                                    TagService.selectTag(newTag);
                                    TagService.addTag(newTag);
                                }
                            }
                        }
                    }
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