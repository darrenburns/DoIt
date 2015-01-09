var module = angular.module('todolist');

module.factory('LevelManager', ['Api', function(Api) {

    var levels = {
        level: -1,
        xpTilLevelUp: -1,
        levelProgress: -1
    };

    return {

        CREATE_TASK_XP: 4,
        ARCHIVE_TASK_XP: 16,
        DELETE_TASK_XP: -5,
        SUBMIT_POMO_XP: 24,

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
        },

        getLevelInfo: function(xp) {
            levels.levelProgress = this.getLevelProgress(xp);
            levels.xpTilLevelUp = this.xpTilLevelUp(xp);
            levels.level = this.xpToLevel(xp);
            return levels;
        }

    }

}]);