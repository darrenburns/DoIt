module = angular.module('todolist');

module.factory('TodoItem', function () {

    // Constructor
    function TodoItem(text, tags, isDone) {
        this.text = text;
        this.tags = tags;
        this.isDone = isDone;
    }

    return TodoItem;

});