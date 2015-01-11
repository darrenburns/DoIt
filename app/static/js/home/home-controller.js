angular.module('todolist')
    .controller('HomeController',
    ['$scope', 'TodoItem',
        'TodoListService', 'TagService', 'Api', '$q',
        '$timeout', '$http', 'Account', '$auth', '$stateParams',
        'LevelManager',
        function ($scope, TodoItem, TodoListService, TagService, Api, $q,
                  $timeout, $http, Account, $auth, $stateParams, LevelManager) {


            if ($auth.isAuthenticated()) {

                $scope.editor = {
                    dpIsOpen: false,
                    isExpanded: false,
                    new: true,  // true when new task, false when editing old
                    taskEditIndex: -1,  // the index in the array of the task being edited
                    openDatePicker: function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        this.dpIsOpen = true;
                    }
                };

                $scope.todoSearch = '';
                $scope.expanded = [];
                $scope.selectedTag = $stateParams.tag;
                Account.getProfile().success(function(data) {
                    $scope.user = data;
                    $scope.levelInfo = LevelManager.getLevelInfo($scope.user.xp);
                    $scope.editor.todo = new Api.Todo({user_id:$scope.user.id});  // The base to-do, ready for editing

                    var todoFilters = [{name: "archived", op: "==", val: false},
                        {name: "done", op: "==", val: false},
                        {name: "deleted", op: "==", val: false},
                        {name: "user_id", op: "==", val: $scope.user.id}
                    ];

                    if ($scope.selectedTag !== '') {
                        todoFilters.push({name: "tags__text", op: "any", val: $scope.selectedTag});
                        $scope.editor.todo.tags = [$scope.selectedTag];
                    }

                    var todoOrderBy = [{"field": "created", "direction": "desc"}];
                    Api.Todo.query({"q": JSON.stringify({"filters": todoFilters, "order_by": todoOrderBy})}, function(response) {
                        $scope.todos = response.objects;
                    });

                    var tagFilters = [{name: "user_id", op: "==", val: $scope.user.id}];
                    Api.Tag.query({"q": JSON.stringify({"filters": tagFilters})}, function(response) {
                        $scope.tags = response.objects;
                        console.log($scope.tags);

                        $scope.addTodo = function($index) {
                            if ($scope.editor.todo.text != '') {
                                console.log('plz');
                                $scope.todos.unshift($scope.editor.todo);  // Update the scope to prevent having to re-query
                                // Replace the attempted newly created tag with the already existing tag
                                for (var newTagIdx = 0; newTagIdx < $scope.editor.todo.tags.length; newTagIdx++) {
                                    var newTag = $scope.editor.todo.tags[newTagIdx];
                                    var found = false;
                                    newTag.user = $scope.user;
                                    for (var oldTagIdx = 0; oldTagIdx < $scope.tags.length; oldTagIdx++) {
                                        var oldTag = $scope.tags[oldTagIdx];
                                        if (oldTag.text == newTag.text) {
                                            found = true;
                                            $scope.editor.todo.tags[newTagIdx] = oldTag;
                                        }
                                    }
                                    if (!found) {
                                        $scope.tags.push(newTag);
                                    }
                                }
                                // TODO: add angular form validation to make sure blank todos cant be submitted
                                if ($scope.editor.new) {
                                    $scope.editor.todo.$save(function() {
                                        $scope.user.xp += LevelManager.CREATE_TASK_XP;
                                        Api.User.update($scope.user);
                                        $scope.levelInfo = LevelManager.getLevelInfo($scope.user.xp);
                                    }, function() {
                                        console.log('error');
                                    });
                                } else {
                                    Api.Todo.update($scope.editor.todo, function() {
                                        // Put the updated item back in the position it was previously
                                        $scope.todos.splice($scope.editor.taskEditIndex, 0, $scope.editor.todo);
                                        $scope.editor.taskEditIndex = -1;
                                        $scope.editor.new = true;

                                    });
                                }
                                $scope.editor.todo = new Api.Todo({user_id:$scope.user.id});  // Reset the to-do
                                if ($scope.selectedTag !== '') {
                                    $scope.editor.todo.tags = [$scope.selectedTag]
                                }
                            }

                        };
                    });

                    $scope.editTask = function(task, $index) {
                        $scope.editor.todo = task;
                        $scope.editor.isExpanded = task.due || task.note;
                        $scope.editor.new = false;
                        $scope.editor.taskEditIndex = $index;
                        $scope.todos.splice($index, 1);
                    };

                    $scope.cancelEditTask = function() {
                        $scope.editor.new = true;
                        $scope.todos.splice($scope.editor.taskEditIndex, 0, $scope.editor.todo);
                        $scope.editor.todo = new Api.Todo({user_id:$scope.user.id});
                        $scope.editor.isExpanded = false;
                        $scope.editor.taskEditIndex = -1;
                    };

                    $scope.deleteTodo = function(todo) {
                        $timeout(function() {
                            todo.deleted =  true;
                            Api.Todo.delete(todo, function() {
                                $scope.user.xp += LevelManager.DELETE_TASK_XP;
                                Api.User.update($scope.user);
                                $scope.levelInfo = LevelManager.getLevelInfo($scope.user.xp);
                            });
                        });
                        // TODO: delete floating tags (no references)
                    };

                    // When you archive a to-do, you remove it from the display.
                    // Done to-dos appear on screen but are crossed out
                    $scope.archiveTodos = function() {
                        var xpReward = 0;
                        angular.forEach($scope.todos, function(todo) {
                            if (todo && todo.done) {
                                console.log(todo.text);
                                xpReward += LevelManager.ARCHIVE_TASK_XP;
                                todo.archived = true;
                                Api.Todo.update(todo);
                            }
                        });

                        $scope.user.xp += xpReward;
                        Api.User.update($scope.user);
                        $scope.levelInfo = LevelManager.getLevelInfo($scope.user.xp);

                        //TODO: Can avoid requery by tracking index here
                        Api.Todo.query({"q": JSON.stringify({"filters": todoFilters, "order_by": todoOrderBy})}, function(response) {
                            $scope.todos = response.objects;
                            // TODO: Stuff to handle todos marked as done properly
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
                    $scope.randomQuote = function() {
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
                            $scope.currentQuote = $scope.randomQuote();
                            this.pomo.success = true;
                            this.pomo.$save(function() {
                                // TODO: shouldn't have to query again here.
                                Api.Todo.query({"q": JSON.stringify({"filters": todoFilters, "order_by": todoOrderBy})}, function(response) {
                                    $scope.todos = response.objects;
                                });
                                $scope.user.xp += LevelManager.SUBMIT_POMO_XP;
                                Api.User.update($scope.user, function() {
                                    $scope.levelInfo = LevelManager.getLevelInfo($scope.user.xp);
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
                        },
                        closeBreakPanel: function() {
                            this.pomoState = 'off';
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

            }

        }]);
