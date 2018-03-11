'use strict';

var getDomArray = require('zhf.get-dom-array');

var eventDelegate = {
    on: function on(parentElement, currentElement) {
        var eventType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'click';
        var fn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

        var parentAll = getDomArray(parentElement);
        parentAll.forEach(function () {});
        var parent = getDomArray(parentElement)[0];

        var current = getDomArray(currentElement)[0];
        if (parent && current) {
            parent.addEventListener(eventType, function (ev) {
                ev = ev || window.event;
                var target = ev.target || ev.srcElement;
                var isParent = false; // 是否冒泡到了父级
                while (target !== current && !isParent) {
                    target = target.parentNode;
                    if (target === parent) {
                        isParent = true;
                    }
                }
                if (target === current) {
                    fn();
                }
            });
        }
    },
    remove: function remove(parentElement, currentElement) {
        var eventType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'click';

        parentElement.removeEventListener(eventType);
    }
};

module.exports = eventDelegate;