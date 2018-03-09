'use strict';

var getDomArray = require('zhf.get-dom-array');

var eventDelegate = {
    on: function on(parentElement, currentElement, eventType, fn) {
        var parent = getDomArray(parentElement)[0];
        var current = getDomArray(currentElement)[0];
        if (parent && current) {
            parent.addEventListener('click', function () {});
        }
    },
    remove: function remove() {}
};

module.exports = eventDelegate;