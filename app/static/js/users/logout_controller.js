var module = angular.module('todolist');

module.controller('LogoutController', ['$auth', '$location',

    function($auth, $location) {

        if (!$auth.isAuthenticated()) {
            return;
        }
        $auth.logout()
            .then(function() {
                $location.path('/#/login')
            });

    }
]);