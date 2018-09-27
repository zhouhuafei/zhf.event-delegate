'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getDomArray = require('zhf.get-dom-array');
var typeOf = require('zhf.type-of');
var isDomParent = require('zhf.is-dom-parent');

var _require = require('zhf.mouse-event'),
    isEnterOrLeave = _require.isEnterOrLeave;

function fnMouse(dom, cb, relatedTarget) {
    // mouseenter mouseleave 处理
    var isSelf = relatedTarget === dom; // 是否是自身
    var isChild = isDomParent(dom, relatedTarget); // 是否是子级
    if (!isSelf && !isChild) {
        // 如不是自身或者是子级，则触发。
        cb && cb.call(dom, dom);
    }
}

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
                    // 存储绑定的事件以及对应的函数
                    parent[name] = {
                        currentElement: currentElement,
                        fn: []
                    };
                    /*
                    focus和blur事件没有冒泡只有捕获。
                    mouseenter和mouseleave需要使用捕获才能获取到对应节点上的ev.relatedTarget。
                    否则ev.relatedTarget是绑定了事件的那个dom上的属性。
                    */
                    var captureArr = ['focus', 'blur'];
                    if (typeOf(parent[name].currentElement) !== 'function') {
                        // 第三个参数如果是个函数。只有事件委托的时候才捕获mouseenter和mouseleave。
                        captureArr.push('mouseenter');
                        captureArr.push('mouseleave');
                    }
                    var isCapture = captureArr.indexOf(eventType) !== -1;
                    parent.addEventListener(eventType, function (ev) {
                        var self = this;
                        ev = ev || window.event;
                        if (typeOf(parent[name].currentElement) === 'function') {
                            // 第三个参数如果是个函数。
                            parent[name].fn.forEach(function (fn) {
                                if (eventType === 'mouseenter' || eventType === 'mouseleave') {
                                    isEnterOrLeave(self, ev.relatedTarget) && fn.call(self, ev);
                                } else {
                                    fn.call(self, ev);
                                }
                            });
                        } else {
                            // 第三个参数不是函数，表示第三个参数是要触发事件的那个元素。
                            var currentAll = getDomArray(parent[name].currentElement, parent); // 从父级下获取目标元素，所以要保证父级下有目标元素才能触发。
                            currentAll.reverse().forEach(function (current) {
                                // 这里的倒叙是为了保证嵌套时的顺序，嵌套时应该是从子到父的顺序。
                                var target = ev.target || ev.srcElement;
                                var isParent = target === parent; // 如果目标元素就是父级，则触发不了，因为目标元素只能从父级下查找，不包括父级自身。
                                while (target !== current && !isParent) {
                                    if (target === parent) {
                                        isParent = true;
                                    } else {
                                        target = target.parentNode;
                                    }
                                }
                                if (target === current) {
                                    // 找到了目标元素。目标元素不可能和父级是同一个dom。因为目标元素是从父级下查找的。所以没必要判断target不等于父级。
                                    parent[name].fn.forEach(function (fn) {
                                        if (eventType === 'mouseenter' || eventType === 'mouseleave') {
                                            isEnterOrLeave(target, ev.relatedTarget) && fn.call(target, ev);
                                        } else {
                                            fn.call(target, ev);
                                        }
                                    });
                                }
                            });
                        }
                    }, isCapture);
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