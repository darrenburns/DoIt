module = angular.module('todolist');

module.factory('TagService', function() {

    // State here
    var allTags = [];

    return {

        getAllTags: function() {
            return allTags;
        },

        getAllSelectedTags: function() {
            var selectedTags = [];
            for (var tagIdx = 0; tagIdx < allTags.length; tagIdx++) {
                if (allTags[tagIdx].selected) {
                    selectedTags.push(allTags[tagIdx]);
                }
            }
            return selectedTags;
        },

        addTag: function(tag) {
            allTags.push(tag);
        },

        addAllTags: function(item) {
            for (var tagIdx = 0; tagIdx < item.tags.length; tagIdx++) {
                var tag = item.tags[tagIdx];
                allTags.push(tag);
            }
        },

        selectTag: function(tag) {
            tag.selected = true;
        },

        toggleSelectTag: function(tag) {
            if (typeof tag.selected !== 'undefined') {
                tag.selected = !tag.selected;
            } else {
                tag.selected = true;
            }
        },

        selectAllTags: function() {
            this.deselectAllTags();
            for (var tagIdx = 0; tagIdx < allTags.length; tagIdx++) {
                allTags[tagIdx].selected = true;
            }
        },

        deselectAllTags: function() {
            for (var tagIdx = 0; tagIdx < allTags.length; tagIdx++) {
                allTags[tagIdx].selected = false;
            }
        }

    }

});