module = angular.module('todolist');

module.factory('TodoItem', function () {

    // Constructor
    function TodoItem(text, tags, isDone, dueDate) {
        this.text = text;
        this.tags = tags;
        this.isDone = isDone;
        this.dueDate = dueDate;
    }

    return TodoItem;

});