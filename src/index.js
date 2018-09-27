const getDomArray = require('zhf.get-dom-array');
const typeOf = require('zhf.type-of');
const isDomParent = require('zhf.is-dom-parent');
const {isEnterOrLeave} = require('zhf.mouse-event');

function fnMouse(dom, cb, relatedTarget) { // mouseenter mouseleave 处理
    const isSelf = relatedTarget === dom; // 是否是自身
    const isChild = isDomParent(dom, relatedTarget); // 是否是子级
    if (!isSelf && !isChild) { // 如不是自身或者是子级，则触发。
        cb && cb.call(dom, dom);
    }
}

class EventDelegate {
    on(parentElement, eventType = 'click', currentElement, fn) {
        const currentElementIsFn = typeOf(currentElement) === 'function';
        if (typeOf(eventType) !== 'string' || (typeOf(currentElement) !== 'string' && !currentElementIsFn) || (!currentElementIsFn && typeOf(fn) !== 'function')) {
            console.log('event-delegate on 方法参数错误');
            return;
        }
        const parentAll = getDomArray(parentElement);
        parentAll.forEach((parent) => {
            const name = EventDelegate.getName(eventType, currentElement);
            if (!parent[name]) {
                // 存储绑定的事件以及对应的函数
                parent[name] = {
                    currentElement: currentElement,
                    fn: [],
                };
                /*
                focus和blur事件没有冒泡只有捕获。
                mouseenter和mouseleave需要使用捕获才能获取到对应节点上的ev.relatedTarget。
                否则ev.relatedTarget是绑定了事件的那个dom上的属性。
                */
                const captureArr = ['focus', 'blur'];
                if (typeOf(parent[name].currentElement) !== 'function') { // 第三个参数如果是个函数。只有事件委托的时候才捕获mouseenter和mouseleave。
                    captureArr.push('mouseenter');
                    captureArr.push('mouseleave');
                }
                const isCapture = captureArr.indexOf(eventType) !== -1;
                parent.addEventListener(eventType, function (ev) {
                    const self = this;
                    ev = ev || window.event;
                    if (typeOf(parent[name].currentElement) === 'function') { // 第三个参数如果是个函数。
                        parent[name].fn.forEach(function (fn) {
                            if (eventType === 'mouseenter' || eventType === 'mouseleave') {
                                isEnterOrLeave(self, ev.relatedTarget) && fn.call(self, ev);
                            } else {
                                fn.call(self, ev);
                            }
                        });
                    } else { // 第三个参数不是函数，表示第三个参数是要触发事件的那个元素。
                        const currentAll = getDomArray(parent[name].currentElement, parent); // 从父级下获取目标元素，所以要保证父级下有目标元素才能触发。
                        currentAll.reverse().forEach(function (current) { // 这里的倒叙是为了保证嵌套时的顺序，嵌套时应该是从子到父的顺序。
                            let target = ev.target || ev.srcElement;
                            let isParent = target === parent; // 如果目标元素就是父级，则触发不了，因为目标元素只能从父级下查找，不包括父级自身。
                            while (target !== current && !isParent) {
                                if (target === parent) {
                                    isParent = true;
                                } else {
                                    target = target.parentNode;
                                }
                            }
                            if (target === current) { // 找到了目标元素。目标元素不可能和父级是同一个dom。因为目标元素是从父级下查找的。所以没必要判断target不等于父级。
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

    off(parentElement, eventType = 'click', currentElement, num) {
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
        const parentAll = getDomArray(parentElement);
        parentAll.forEach(function (parent) {
            const name = EventDelegate.getName(eventType, currentElement);
            if (parent[name]) {
                if (isNaN(Number(num))) {
                    parent[name].fn.length = 0;
                } else {
                    parent[name].fn.splice(num, 1);
                }
            }
        });
    }

    emit(parentElement, eventType = 'click', currentElement, data = {}) {
        if (arguments.length === 2) {
            if (typeOf(eventType) !== 'string') {
                console.log('event-delegate emit 方法参数错误');
                return;
            }
        } else if (arguments.length === 3) {
            const currentElementIsObject = typeOf(currentElement) === 'object';
            if (typeOf(eventType) !== 'string' || (typeOf(currentElement) !== 'string' && !currentElementIsObject)) {
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
        const parentAll = getDomArray(parentElement);
        parentAll.forEach((parent) => {
            const name = EventDelegate.getName(eventType, currentElement);
            if (parent[name]) {
                parent[name].fn.forEach(function (fn) {
                    fn(parent, data);
                });
            }
        });
    }

    static getName(eventType, currentElement) {
        let name = `unique${eventType}`;
        if (typeOf(currentElement) !== 'function' && currentElement !== undefined) {
            name += currentElement;
        }
        return name;
    }
}

const eventDelegate = new EventDelegate();

module.exports = eventDelegate;
