angular.module('todolist')
    .controller('HomeController',
    ['$scope', 'TodoItem',
        'TodoListService', 'TagService', 'Api', '$q', '$timeout', '$http', 'Account', '$auth', '$stateParams',
        function ($scope, TodoItem, TodoListService, TagService, Api, $q, $timeout, $http, Account, $auth, $stateParams) {

            if ($auth.isAuthenticated()) {

                $scope.selectedTag = $stateParams.tag;
                Account.getProfile().success(function(data) {
                    $scope.user = data;

                    var todoFilters = [{name: "archived", op: "==", val: false},
                        {name: "done", op: "==", val: false},
                        {name: "deleted", op: "==", val: false},
                        {name: "user_id", op: "==", val: $scope.user.id}
                    ];

                    if ($scope.selectedTag !== '') {
                        todoFilters.push({name: "tags__text", op: "any", val: $scope.selectedTag})
                    }

                    var todoOrderBy = [{"field": "created", "direction": "desc"}];
                    Api.Todo.query({"q": JSON.stringify({"filters": todoFilters, "order_by": todoOrderBy})}, function(response) {
                        $scope.todos = response.objects;
                    });

                    var tagFilters = [{name: "user_id", op: "==", val: $scope.user.id}];
                    Api.Tag.query({"q": JSON.stringify({"filters": tagFilters})}, function(response) {
                        $scope.tags = response.objects;
                        console.log($scope.tags);
                    });


                    $scope.todo = new Api.Todo({user_id:$scope.user.id});  // The base to-do, ready for editing

                    $scope.addTodo = function() {
                        $scope.todos.unshift($scope.todo);  // Update the scope to prevent having to re-query
                        // TODO: Sometimes tags don't appear straight away (when multiple are added at once?)
                        if ($scope.tags.length > 0) {
                            // Replace the attempted newly created tag with the already existing tag
                            for (var newTagIdx = 0; newTagIdx < $scope.todo.tags.length; newTagIdx++) {
                                var newTag = $scope.todo.tags[newTagIdx];
                                var found = false;
                                $scope.todo.tags[newTagIdx].user = $scope.user;
                                console.log($scope.todo.tags[newTagIdx], $scope.user.id);
                                for (var oldTagIdx = 0; oldTagIdx < $scope.tags.length; oldTagIdx++) {
                                    var oldTag = $scope.tags[oldTagIdx];
                                    if (oldTag.text == newTag.text) {
                                        found = true;
                                        $scope.todo.tags[newTagIdx] = oldTag;
                                    }
                                }
                                if (!found) {
                                    $scope.tags.push(newTag);
                                }
                            }

                        }
                        // TODO: add angular form validation to make sure blank todos cant be submitted
                        $scope.todo.$save(function() {
                            console.log('saved');
                            $scope.todo = new Api.Todo({user_id:$scope.user.id});  // Reset the to-do
                        }, function() {
                            console.log('error');
                        });
                    };

                    $scope.deleteTodo = function(todo) {
                        $timeout(function() {
                            todo.deleted =  true;
                            Api.Todo.delete(todo);
                        });
                        // TODO: delete floating tags (no references)
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

                    $scope.filterTodos = function(tagText) {

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
                            quote: 'The secret to getting ahead is getting started.',
                            by: 'Unknown'
                        },
                        {
                            quote: 'It always seems impossible until it is done.',
                            by: 'Unknown'
                        },
                        {
                            quote: 'A year from now you\'ll wish you started today.',
                            by: 'Karen Lamb'
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

                            // Start the timer and alter pomoState to 'running'
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


                });

                // Loads tags for the tag input field
                $scope.loadTags = function(query) {
                    var deferred = $q.defer();
                    var returnedTags = $scope.tags;
                    returnedTags = returnedTags.filter(function(item) {
                        return item.text.indexOf(query) > -1;
                    });
                    deferred.resolve(returnedTags);
                    return deferred.promise;
                };

                $scope.selectedTags = TagService.getAllSelectedTags();

                $scope.selectAllTags = TagService.selectAllTags;
                $scope.deselectAllTags = TagService.deselectAllTags;
                $scope.toggleSelectTag = TagService.toggleSelectTag;

            }

        }]);
