angular.module('todolist')
    .controller('HomeController',
    ['$scope', 'TodoItem',
        'TodoListService', 'TagService', 'Api', '$q',
        function ($scope, TodoItem, TodoListService, TagService, Api, $q) {

            $scope.todoSearch = '';

            $scope.allTags = [];
            Api.Tag.query(function(response) {
                $scope.allTags = response.objects;
                // TODO: Stuff to monitor selected tags
            });

            $scope.todos = [];
            var filters = [{"name": "archived", "op": "==", "val": false},
                {"name": "done", "op": "==", "val": false}];
            var orderBy = [{"field": "created", "direction": "desc"}];
            Api.Todo.query({"q": JSON.stringify({"filters": filters, "order_by": orderBy})}, function(response) {
                $scope.todos = response.objects;
            });

            $scope.todo = new Api.Todo();  // The base to-do, ready for editing

            $scope.addTodo = function() {
                $scope.todos.unshift($scope.todo);  // Update the scope to prevent having to re-query
                // TODO: Sometimes tags don't appear straight away (when multiple are added at once?)
                if ($scope.allTags.length > 0) {
                    // Replace the attempted newly created tag with the already existing tag
                    for (var newTagIdx = 0; newTagIdx < $scope.todo.tags.length; newTagIdx++) {
                        var newTag = $scope.todo.tags[newTagIdx];
                        for (var oldTagIdx = 0; oldTagIdx < $scope.allTags; oldTagIdx++) {
                            var oldTag = $scope.allTags[oldTagIdx];
                            if (oldTag.text == newTag.text) {
                                $scope.todo.tags[newTagIdx] = oldTag;
                            }
                        }
                    }

                }
                // TODO: add angular form validation to make sure blank todos cant be submitted
                $scope.todo.$save(function() {
                    console.log('saved');
                    $scope.todo = new Api.Todo();  // Reset the to-do
                }, function() {
                    console.log('error');
                });
            };

            $scope.deleteTodo = function(todo) {
                Api.Todo.delete(todo);
                // TODO: delete floating tags (no references)
            };

            // Loads tags for the tag input field
            $scope.loadTags = function(query) {
                var deferred = $q.defer();
                var returnedTags = $scope.allTags;
                returnedTags = returnedTags.filter(function(item) {
                    return item.text.indexOf(query) > -1;
                });
                deferred.resolve(returnedTags);
                return deferred.promise;
            };

            // When you archive a to-do, you remove it from the display.
            // Done to-dos appear on screen but are crossed out
            $scope.archiveTodos = function() {
                angular.forEach($scope.todos, function(todo) {
                    if (todo && todo.done) {
                        todo.archived = true;
                        Api.Todo.update(todo);
                        //TODO: instantly remove this from the list of todos here instead of requeyrying? LOW PRIORITY
                        Api.Todo.query({"q": JSON.stringify({"filters": filters, "order_by": orderBy})}, function(response) {
                            $scope.todos = response.objects;
                            // TODO: Stuff to handle todos marked as done properly
                        });
                    }
                });
            };

            // Pomodoro timer
            $scope.pomodoro = {
                pomo: new Api.Pomodoro(),
                activePomoTodo: null,
                pomoRunning: false,  // Defines whether the pomodoro menu is open or not
                showPomoSubmit: false,
                startPomo: function(todo) {
                    // Link the pomo to the selected to-do item
                    this.pomoRunning = true;
                    this.activePomoTodo = todo;
                    this.pomo.todo_id = todo.id;

                    // Start the timer and alter pomoRunning to true
                    $scope.$broadcast('timer-start');
                },
                cancelPomo: function() {
                    // Save the pomodoro with a failure
                    $scope.$broadcast('timer-stop');
                    this.pomo = new Api.Pomodoro();
                    this.pomoRunning = false;
                    this.showPomoSubmit = false;
                    this.activePomoTodo = null;
                },
                pomoFinished: function() {
                    console.log('pomodoro has finished');
                    this.showPomoSubmit = true;
                    var audio = new Audio('../../audio/gong.mp3');
                    audio.play();
                    $scope.$apply();
                },
                submitPomo: function() {
                    console.log('pomodoro has been submitted');
                    this.pomo.success = true;
                    this.pomo.$save(function() {
                        // TODO: shouldn't have to query again here.
                        Api.Todo.query({"q": JSON.stringify({"filters": filters, "order_by": orderBy})}, function(response) {
                            $scope.todos = response.objects;
                        });
                    });
                    this.pomo = new Api.Pomodoro();
                    this.showPomoSubmit = false;
                    this.pomoRunning = false;
                    this.activePomoTodo = null;
                }


            };



            $scope.selectedTags = TagService.getAllSelectedTags();

            $scope.selectAllTags = TagService.selectAllTags;
            $scope.deselectAllTags = TagService.deselectAllTags;
            $scope.toggleSelectTag = TagService.toggleSelectTag;

        }]);
