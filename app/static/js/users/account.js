angular.module('todolist')
  .factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('/api/me');
      }
    };
  });