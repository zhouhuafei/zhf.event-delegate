'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getDomArray = require('zhf.get-dom-array');
var typeOf = require('zhf.type-of');

var EventDelegate = function () {
    function EventDelegate() {
        _classCallCheck(this, EventDelegate);
    }

    _createClass(EventDelegate, [{
        key: 'on',
        value: function on(parentElement) {
            var eventType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'click';
            var currentElement = arguments[2];
            var fn = arguments[3];

            if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string' || typeOf(fn) !== 'function') {
                console.log('event-delegate on 方法参数错误');
                return;
            }
            var parentAll = getDomArray(parentElement);
            parentAll.forEach(function (parent) {
                var name = EventDelegate.getName(eventType, currentElement);
                if (!parent[name]) {
                    parent[name] = {
                        currentElement: currentElement,
                        fn: []
                    };
                    parent.addEventListener(eventType, function (ev) {
                        ev = ev || window.event;
                        var target = ev.target || ev.srcElement;
                        var isParent = false; // 是否冒泡到了父级
                        if (target === parent) {
                            isParent = true;
                        }
                        var currentAll = getDomArray(parent[name].currentElement, parent);
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
                            if (target === current) {
                                parent[name].fn.forEach(function (fn) {
                                    fn.call(target);
                                });
                            }
                        });
                    });
                }
                parent[name].fn.push(fn);
            });
        }
    }, {
        key: 'off',
        value: function off(parentElement) {
            var eventType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'click';
            var currentElement = arguments[2];
            var num = arguments[3];

            if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string') {
                console.log('event-delegate off 方法参数错误');
                return;
            }

            var parentAll = getDomArray(parentElement);
            parentAll.forEach(function (parent) {
                var name = EventDelegate.getName(eventType, currentElement);
                if (parent[name]) {
                    if (isNaN(Number(num))) {
                        parent[name].fn.length = 0;
                    } else {
                        parent[name].fn.splice(num, 1);
                    }
                }
            });
        }
    }, {
        key: 'emit',
        value: function emit(parentElement) {
            var eventType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'click';
            var currentElement = arguments[2];

            if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string') {
                console.log('event-delegate emit 方法参数错误');
                return;
            }
            var parentAll = getDomArray(parentElement);
            parentAll.forEach(function (parent) {
                var name = EventDelegate.getName(eventType, currentElement);
                if (parent[name]) {
                    console.log(name);
                    parent[name].fn.forEach(function (fn) {
                        fn();
                    });
                }
            });
        }
    }], [{
        key: 'getName',
        value: function getName(eventType, currentElement) {
            return 'unique' + eventType + currentElement;
        }
    }]);

    return EventDelegate;
}();

var eventDelegate = new EventDelegate();

module.exports = eventDelegate;