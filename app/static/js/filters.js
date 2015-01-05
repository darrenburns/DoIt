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

module.filter('highlight', ['$sce', function($sce) {
          // We return a function which is called when we call the filter from the template.
     return function(text, phrase) {
          if (phrase) {
               // below we are using regex group capture and accessing it through
               // the $1 notation. the ‘g’ flag indicates global search and the ‘i’
               // flag is used to ignore case
               text = text.replace(new RegExp('('+phrase+')', 'gi'),
                                   '<b>$1</b>'
                                   );
          }
          return $sce.trustAsHtml(text);
     }
}]);