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
                parent[name] = {
                    currentElement: currentElement,
                    fn: [],
                };
                parent.addEventListener(eventType, function (ev) {
                    const self = this;
                    ev = ev || window.event;
                    let target = ev.target || ev.srcElement;
                    let isParent = false; // 是否冒泡到了父级
                    if (target === parent) {
                        isParent = true;
                    }
                    if (typeOf(parent[name].currentElement) === 'function') {
                        parent[name].fn.forEach(function (fn) {
                            fn.call(self, ev);
                        });
                    } else {
                        const currentAll = getDomArray(parent[name].currentElement, parent);
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

    emit(parentElement, eventType = 'click', currentElement, data) {
        if (arguments.length === 2) {
            if (typeOf(eventType) !== 'string') {
                console.log('event-delegate emit 方法参数错误');
                return;
            }
        } else if (arguments.length === 3) {
            if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string') {
                console.log('event-delegate emit 方法参数错误');
                return;
            }
        } else if (arguments.length === 4) {
            if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string') {
                console.log('event-delegate emit 方法参数错误');
                return;
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
