module = angular.module('todolist');

module.filter('showSelectedOnly', function() {
    return function(todos) {
        //if (todos && todos.length > 0) {
        //    var filteredItems = [];
        //    for (var todoIdx = 0; todoIdx < todos.length; todoIdx++) {
        //        var todo = todos[todoIdx];
        //        var tags = todo.tags;
        //        for (var tagIdx = 0; tagIdx < tags.length; tagIdx++) {
        //            var tag = tags[tagIdx];
        //            if (tag.selected) {
        //                filteredItems.push(todo);
        //                break;
        //            }
        //        }
        //    }
        //    return filteredItems;
        //}
        //
        //return [];
        return todos;
    }
});