'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getDomArray = require('zhf.get-dom-array');
var EventEmitter = require('zhf.event-emitter');
var event = new EventEmitter();
var createUniqueChar = function createUniqueChar() {
    return new Date().getTime() + Math.random().toString().substring(2);
};

/*
const eventDelegate = {
    on(parentElement, eventType = 'click', currentElement, fn = function () {
    }) {
        const parentAll = getDomArray(parentElement);
        const currentAll = getDomArray(currentElement);
        parentAll.forEach(function (parent) {
            if (parent) {
                parent.addEventListener(eventType, function (ev) {
                    ev = ev || window.event;
                    let target = ev.target || ev.srcElement;
                    let isParent = false; // 是否冒泡到了父级
                    if (target === parent) {
                        isParent = true;
                    }
                    currentAll.reverse().forEach(function (current) {
                        target = ev.target || ev.srcElement;
                        isParent = false;
                        while (target !== current && !isParent) {
                            if (target === parent) {
                                isParent = true;
                            } else {
                                target = target.parentNode;
                            }
                        }
                        console.log(target);
                        if (target === current) {
                            fn.call(target);
                        }
                    });
                });
            }
        });
    },
    remove(parentElement, eventType = 'click', currentElement) {
        // 这个移除是无效的
        parentElement.removeEventListener(eventType);
    },
};
*/

console.log(createUniqueChar());
console.log(createUniqueChar());
console.log(createUniqueChar());

var EventDelegate = function () {
    function EventDelegate() {
        _classCallCheck(this, EventDelegate);

        this.parentElementArray = [];
    }

    _createClass(EventDelegate, [{
        key: 'on',
        value: function on(parentElement) {
            var eventType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'click';
            var currentElement = arguments[2];
            var fn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

            var parentAll = getDomArray(parentElement);
            parentAll.forEach(function (parent) {
                parent.dataset.unique = createUniqueChar();
                var currentAll = getDomArray(currentElement, parent); // getDomArray等待升级一下，第二参数是父级
            });
        }
    }, {
        key: 'off',
        value: function off(parentElement) {
            var eventType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'click';
            var currentElement = arguments[2];
        }
    }, {
        key: 'emit',
        value: function emit(parentElement) {
            var eventType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'click';
            var currentElement = arguments[2];
        }
    }]);

    return EventDelegate;
}();

var eventDelegate = new EventDelegate();

module.exports = eventDelegate;