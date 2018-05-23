const getDomArray = require('zhf.get-dom-array');
const typeOf = require('zhf.type-of');

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
                const isCapture = ['focus', 'blur'].indexOf(eventType) !== -1; // focus和blur事件没有冒泡只有捕获。
                parent.addEventListener(eventType, function (ev) {
                    const self = this;
                    ev = ev || window.event;
                    let target = ev.target || ev.srcElement;
                    let isParent = false; // 是否冒泡到了父级。
                    if (target === parent) {
                        isParent = true;
                    }
                    if (typeOf(parent[name].currentElement) === 'function') { // 第三个参数如果是个函数。
                        parent[name].fn.forEach(function (fn) {
                            fn.call(self, ev);
                        });
                    } else { // 第三个参数不是函数，表示第三个参数是要触发事件的那个元素。
                        const currentAll = getDomArray(parent[name].currentElement, parent);
                        currentAll.reverse().forEach(function (current) { // 这里的倒叙是为了提高性能。如果出现嵌套的情况，则可以减少循环次数。
                            target = ev.target || ev.srcElement;
                            isParent = false;
                            while (target !== current && !isParent) { // 事件委托不可以委托到自身，例如事件绑定到body上，委托的对象如果也是body，那么委托是无效的。
                                if (target === parent) {
                                    isParent = true;
                                } else {
                                    target = target.parentNode;
                                }
                            }
                            if (target === current) { // 找到了目标元素。
                                parent[name].fn.forEach(function (fn) {
                                    fn.call(target, ev);
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
