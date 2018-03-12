'use strict';

var getDomArray = require('zhf.get-dom-array');

var eventDelegate = {
    on: function on(parentElement, currentElement) {
        var eventType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'click';
        var fn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

        var parentAll = getDomArray(parentElement);
        var currentAll = getDomArray(currentElement);
        parentAll.forEach(function (parent) {
            if (parent) {
                parent.addEventListener(eventType, function (ev) {
                    ev = ev || window.event;
                    var target = ev.target || ev.srcElement;
                    var isParent = false; // 是否冒泡到了父级
                    if (target === parent) {
                        isParent = true;
                    }
                    currentAll.forEach(function (current) {
                        while (target !== current && !isParent) {
                            target = target.parentNode;
                            if (target === parent) {
                                isParent = true;
                            }
                            console.log(target);
                        }
                        if (target === current) {
                            fn.call(target);
                        }
                    });
                });
            }
        });
    },
    remove: function remove(parentElement) {
        var eventType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'click';

        // 这个移除是无效的
        parentElement.removeEventListener(eventType);
    }
};

module.exports = eventDelegate;