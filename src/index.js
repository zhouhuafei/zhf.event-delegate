const getDomArray = require('zhf.get-dom-array');
const EventEmitter = require('zhf.event-emitter');
const isDomParent = require('zhf.is-dom-parent');
const typeOf = require('zhf.type-of');
const event = new EventEmitter();
const createUniqueChar = function () {
    return (new Date().getTime() + Math.random().toString().substring(2));
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

class EventDelegate {
    constructor() {
    }

    on(parentElement, eventType = 'click', currentElement, fn) {
        if (typeOf(eventType) !== 'string' || typeOf(currentElement) !== 'string' || typeOf(fn) !== 'function') {
            console.log('event-delegate on 方法参数错误');
            return;
        }
        const parentAll = getDomArray(parentElement);
        parentAll.forEach((parent) => {
            if (typeOf(parentElement) !== 'string') {
                if (!parent.dataset.unique) {
                    parent.dataset.unique = createUniqueChar();
                }
            }
            const name = EventDelegate.getName(parent, parentElement, eventType, currentElement);
            event.on(name, function (json) {
                fn.call(json.nowData.dom);
            });
        });
        /*
        parentAll.forEach(function (parent) {
            parent.addEventListener(eventType, function (ev) {
                let name = `unique${eventType}${currentElement}`;
                if (typeOf(parentElement) !== 'string') {
                    if (!parent.dataset.unique) {
                        parent.dataset.unique = createUniqueChar();
                    }
                    name = `${name}${parent.dataset.unique}`;
                } else {
                    name = `${name}${parentElement}`;
                }
                event.emit(name, {
                    dom: ev.target,
                });
            });
        });
        */
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
            event.emit(name, {
                dom: undefined,
            });
        });
    }

    static getName(parent, parentElement, eventType, currentElement) {
        let name = `unique${eventType}${currentElement}`;
        if (typeOf(parentElement) !== 'string') {
            name = `${name}${parent.dataset.unique}`;
        } else {
            name = `${name}${parentElement}`;
        }
        return name;
    }
}

const eventDelegate = new EventDelegate();

module.exports = eventDelegate;
