const getDomArray = require('zhf.get-dom-array');
const EventEmitter = require('zhf.event-emitter');
const typeOf = require('zhf.type-of');
const event = new EventEmitter();
const createUniqueChar = function () {
    return (new Date().getTime() + Math.random().toString().substring(2));
};

class EventDelegate {
    on(parentElement, eventType = 'click', currentElement, fn) {
        if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string' || typeOf(fn) !== 'function') {
            console.log('event-delegate on 方法参数错误');
            return;
        }
        const parentAll = getDomArray(parentElement);
        parentAll.forEach((parent) => {
            if (!parent.unique) {
                parent.unique = createUniqueChar();
            }
            const name = EventDelegate.getName(parent, parentElement, eventType, currentElement);
            console.log(name);
            event.on(name, function (json) {
                fn.call(json.nowData && json.nowData.dom);
            });
        });
        parentAll.forEach(function (parent) {
            const name = EventDelegate.getName(parent, parentElement, eventType, currentElement);
            if (!parent[name]) {
                parent[name] = currentElement;
                parent.addEventListener(eventType, function (ev) {
                    ev = ev || window.event;
                    let target = ev.target || ev.srcElement;
                    let isParent = false; // 是否冒泡到了父级
                    if (target === parent) {
                        isParent = true;
                    }
                    const currentAll = getDomArray(parent[name], parent);
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
                            event.emit(name, {
                                dom: ev.target,
                            });
                        }
                    });
                });
            }
        });
    }

    off(parentElement, eventType = 'click', currentElement, num) {
        if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string') {
            console.log('event-delegate off 方法参数错误');
            return;
        }
        const parentAll = getDomArray(parentElement);
        parentAll.forEach(function (parent) {
            const name = EventDelegate.getName(parent, parentElement, eventType, currentElement);
            if (isNaN(Number(num))) {
                event.off(name);
            } else {
                event.off(name, num);
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
            const name = EventDelegate.getName(parent, parentElement, eventType, currentElement);
            event.emit(name);
        });
    }

    static getName(parent, parentElement, eventType, currentElement) {
        return `unique${parent.unique}${parentElement}${eventType}${currentElement}`;
    }
}

const eventDelegate = new EventDelegate();

module.exports = eventDelegate;
