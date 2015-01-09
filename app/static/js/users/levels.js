var module = angular.module('todolist');

module.factory('LevelManager', [function() {

    return {
        /*
         Return the users level given their xp.
         */
        xpToLevel: function(xp) {
            return Math.floor(xp / 100);
        },

        xpTilLevelUp: function(xp) {
            return 100 - (xp % 100)
        },

        /*
        Return the users progress through their current level as
        a decimal
         */
        getLevelProgress: function(xp) {
            return (xp % 100) / 100;
        }
    }

}]);