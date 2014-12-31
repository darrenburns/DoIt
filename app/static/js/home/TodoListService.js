module = angular.module('todolist');

module.factory('TodoListService', ['TodoItem', 'TagService', function(TodoItem, TagService) {

    // State here
    var todos = [];

    return {

        getTodos: function() {
            return todos;
        },

        addTodo: function (text, tags) {


            console.log(text, tags);
            // Create a new item
            var item = new TodoItem(text, tags, false);

            if (text.length > 1) {
                todos.push(item);


                // Add all of the tags from the new item
                if (TagService.getAllTags().length == 0) {
                    TagService.addAllTags(item)
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

        getTagsAsStrings: function(todo) {
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