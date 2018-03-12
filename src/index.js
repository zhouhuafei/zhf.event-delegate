const getDomArray = require('zhf.get-dom-array');
const EventEmitter = require('zhf.event-emitter');
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

console.log(createUniqueChar());
console.log(createUniqueChar());
console.log(createUniqueChar());

class EventDelegate {
    constructor() {
        this.parentElementArray = [];
    }

    on(parentElement, eventType = 'click', currentElement, fn = function () {
    }) {
        const parentAll = getDomArray(parentElement);
        parentAll.forEach(function (parent) {
            parent.dataset.unique = createUniqueChar();
            const currentAll = getDomArray(currentElement, parent); // getDomArray等待升级一下，第二参数是父级
        });
    }

    off(parentElement, eventType = 'click', currentElement) {
    }

    emit(parentElement, eventType = 'click', currentElement) {
    }
}

const eventDelegate = new EventDelegate();

module.exports = eventDelegate;
