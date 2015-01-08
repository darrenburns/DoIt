module = angular.module('todolist');

module.controller('LoginController', ['$scope', '$auth',
    function($scope, $auth) {

        //$scope.login = function() {
        //    $auth.login({ email: $scope.email, password: $scope.password })
        //        .then(function() {
        //            $alert({
        //                content: 'You have successfully logged in',
        //                animation: 'fadeZoomFadeDown',
        //                type: 'material',
        //                duration: 3
        //            });
        //        })
        //        .catch(function(response) {
        //            $alert({
        //                content: response.data.message,
        //                animation: 'fadeZoomFadeDown',
        //                type: 'material',
        //                duration: 3
        //            });
        //        });
        //};
        $scope.authenticate = function(provider) {
            $auth.authenticate(provider)
                .then(function() {
                    console.log('successful log in');
                })
                .catch(function(response) {
                    console.log('login error');
                });
        };

        $scope.logout = function() {
            $auth.logout()
                .then(function() {
                    console.log('logged oot')
                });
        }

    }]);