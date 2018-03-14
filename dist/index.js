'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getDomArray = require('zhf.get-dom-array');
var EventEmitter = require('zhf.event-emitter');
var isDomParent = require('zhf.is-dom-parent');
var typeOf = require('zhf.type-of');
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
                if (typeOf(parentElement) !== 'string') {
                    if (!parent.dataset.unique) {
                        parent.dataset.unique = createUniqueChar();
                    }
                }
                var name = EventDelegate.getName(parent, parentElement, eventType, currentElement);
                event.on(name, function (json) {
                    fn.call(json.nowData && json.nowData.dom);
                });
            });
            parentAll.forEach(function (parent) {
                parent.addEventListener(eventType, function (ev) {
                    var name = EventDelegate.getName(parent, parentElement, eventType, currentElement);
                    event.emit(name, {
                        dom: ev.target
                    });
                });
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
                var name = EventDelegate.getName(parent, parentElement, eventType, currentElement);
                if (isNaN(Number(num))) {
                    event.off(name);
                } else {
                    event.off(name, num);
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
                var name = EventDelegate.getName(parent, parentElement, eventType, currentElement);
                event.emit(name);
            });
        }
    }], [{
        key: 'getName',
        value: function getName(parent, parentElement, eventType, currentElement) {
            var name = 'unique' + eventType + currentElement;
            if (typeOf(parentElement) !== 'string') {
                name = '' + name + parent.dataset.unique;
            } else {
                name = '' + name + parentElement;
            }
            return name;
        }
    }]);

    return EventDelegate;
}();

var eventDelegate = new EventDelegate();

module.exports = eventDelegate;