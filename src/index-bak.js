const getDomArray = require('zhf.get-dom-array');
const typeOf = require('zhf.type-of');

class EventDelegate {
    on(parentElement, eventType = 'click', currentElement, fn) {
        if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string' || typeOf(fn) !== 'function') {
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
                    ev = ev || window.event;
                    let target = ev.target || ev.srcElement;
                    let isParent = false; // 是否冒泡到了父级
                    if (target === parent) {
                        isParent = true;
                    }
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
                });
            }
            parent[name].fn.push(fn);
        });
    }

    off(parentElement, eventType = 'click', currentElement, num) {
        if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string') {
            console.log('event-delegate off 方法参数错误');
            return;
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

    emit(parentElement, eventType = 'click', currentElement) {
        if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string') {
            console.log('event-delegate emit 方法参数错误');
            return;
        }
        const parentAll = getDomArray(parentElement);
        parentAll.forEach((parent) => {
            const name = EventDelegate.getName(eventType, currentElement);
            if (parent[name]) {
                parent[name].fn.forEach(function (fn) {
                    fn();
                });
            }
        });
    }

    static getName(eventType, currentElement) {
        return `unique${eventType}${currentElement}`;
    }
}

const eventDelegate = new EventDelegate();

module.exports = eventDelegate;
