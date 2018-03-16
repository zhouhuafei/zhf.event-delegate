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

            var currentElementIsFn = typeOf(currentElement) === 'function';
            if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string' && !currentElementIsFn || !currentElementIsFn && typeOf(fn) !== 'function') {
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
                        var self = this;
                        ev = ev || window.event;
                        var target = ev.target || ev.srcElement;
                        var isParent = false; // 是否冒泡到了父级
                        if (target === parent) {
                            isParent = true;
                        }
                        if (typeOf(parent[name].currentElement) === 'function') {
                            parent[name].fn.forEach(function (fn) {
                                fn.call(self, ev);
                            });
                        } else {
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
                                        fn.call(target, ev);
                                    });
                                }
                            });
                        }
                    });
                }
                parent[name].fn.push(currentElementIsFn ? currentElement : fn);
            });
        }
    }, {
        key: 'off',
        value: function off(parentElement) {
            var eventType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'click';
            var currentElement = arguments[2];
            var num = arguments[3];

            if (arguments.length === 2) {
                if (typeOf(eventType) !== 'string') {
                    console.log('event-delegate off 方法参数错误');
                    return;
                }
            } else if (arguments.length === 3) {
                if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string') {
                    console.log('event-delegate off 方法参数错误');
                    return;
                }
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
            var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            if (arguments.length === 2) {
                if (typeOf(eventType) !== 'string') {
                    console.log('event-delegate emit 方法参数错误');
                    return;
                }
            } else if (arguments.length === 3) {
                var currentElementIsObject = typeOf(currentElement) === 'object';
                if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string' && !currentElementIsObject) {
                    console.log('event-delegate emit 方法参数错误');
                    return;
                }
                if (currentElementIsObject) {
                    data = currentElement;
                    currentElement = undefined;
                }
            } else if (arguments.length === 4) {
                if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string') {
                    console.log('event-delegate emit 方法参数错误');
                    return;
                }
                if (typeOf(data) !== 'object') {
                    console.log('event-delegate emit 第四参数错误 第四参数是数据必须为对象');
                }
            }
            var parentAll = getDomArray(parentElement);
            parentAll.forEach(function (parent) {
                var name = EventDelegate.getName(eventType, currentElement);
                if (parent[name]) {
                    parent[name].fn.forEach(function (fn) {
                        fn(parent, data);
                    });
                }
            });
        }
    }], [{
        key: 'getName',
        value: function getName(eventType, currentElement) {
            var name = 'unique' + eventType;
            if (typeOf(currentElement) !== 'function' && currentElement !== undefined) {
                name += currentElement;
            }
            return name;
        }
    }]);

    return EventDelegate;
}();

var eventDelegate = new EventDelegate();

module.exports = eventDelegate;