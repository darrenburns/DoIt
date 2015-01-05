angular.module('todolist')
    .controller('HomeController',
    ['$scope', 'TodoItem',
        'TodoListService', 'TagService', 'Api', '$q', '$timeout',
        function ($scope, TodoItem, TodoListService, TagService, Api, $q, $timeout) {

            $scope.todoSearch = '';

            $scope.allTags = [];
            Api.Tag.query(function(response) {
                $scope.allTags = response.objects;
                // TODO: Stuff to monitor selected tags
            });

            $scope.todos = [];
            var filters = [{"name": "archived", "op": "==", "val": false},
                {"name": "done", "op": "==", "val": false},
                {"name": "deleted", "op": "==", "val": false}];
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
                $timeout(function() {
                    todo.deleted =  true;
                    Api.Todo.delete(todo);
                    console.log($scope.todos);
                });
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

            var quotes = [
                {
                    quote: 'It does not matter how slowly you go as long as you do not stop.',
                    by: 'Confucius'
                },
                {
                    quote: 'Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.',
                    by: 'Thomas A. Edison'
                },
                {
                    quote: 'Always do your best. What you plant now, you will harvest later.',
                    by: 'Og Mandino'
                }
            ];
            var randomQuote = function() {
                return quotes[Math.floor(Math.random() * quotes.length)];
            };
            $scope.currentQuote = '';

            // Pomodoro timer
            var gongAudio = new Audio('../../audio/gong.mp3');
            $scope.pomodoro = {
                pomo: new Api.Pomodoro(),
                activePomoTodo: null,
                pomoState: 'off',  // 'running' || 'finished' || 'break' || 'break-finished' || 'off'
                startPomo: function(todo) {
                    // Link the pomo to the selected to-do item
                    this.pomoState = 'running';
                    this.activePomoTodo = todo;
                    this.pomo.todo_id = todo.id;

                    // Start the timer and alter pomoRunning to true
                    $scope.$broadcast('timer-start');
                },
                cancelPomo: function() {
                    // Save the pomodoro with a failure
                    $scope.$broadcast('timer-stop');
                    this.pomo = new Api.Pomodoro();
                    this.pomoState = 'off';
                    this.activePomoTodo = null;
                },
                pomoFinished: function() {
                    console.log('pomodoro has finished');
                    this.pomoState = 'finished';
                    gongAudio.load();
                    gongAudio.play();
                    $scope.$apply();
                },
                submitPomo: function() {
                    console.log('pomodoro has been submitted');
                    this.pomoState = 'break';
                    $scope.currentQuote = randomQuote();
                    this.pomo.success = true;
                    this.pomo.$save(function() {
                        // TODO: shouldn't have to query again here.
                        Api.Todo.query({"q": JSON.stringify({"filters": filters, "order_by": orderBy})}, function(response) {
                            $scope.todos = response.objects;
                        });
                    });
                    this.pomo = new Api.Pomodoro();
                },
                finishBreak: function() {
                    gongAudio.load();
                    gongAudio.play();
                    this.pomoState = 'break-finished';
                    $scope.$apply();
                    console.log('break is finished!');
                }

            };



            $scope.selectedTags = TagService.getAllSelectedTags();

            $scope.selectAllTags = TagService.selectAllTags;
            $scope.deselectAllTags = TagService.deselectAllTags;
            $scope.toggleSelectTag = TagService.toggleSelectTag;

        }]);
