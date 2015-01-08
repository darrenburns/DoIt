var module = angular.module('todolist');

module.controller('LogoutController', ['$auth',

    function($auth) {

        if (!$auth.isAuthenticated()) {
            return;
        }
        $auth.logout()
            .then(function() {
                console.log('LOGGED OUT');
            });

    }
]);