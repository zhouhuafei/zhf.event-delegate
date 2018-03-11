const getDomArray = require('zhf.get-dom-array');

const eventDelegate = {
    on(parentElement, currentElement, eventType = 'click', fn = function () {
    }) {
        const parentAll = getDomArray(parentElement);
        const currentAll = getDomArray(currentElement);
        parentAll.forEach(function (parent) {
            if (parent) {
                parent.addEventListener(eventType, function (ev) {
                    ev = ev || window.event;
                    let target = ev.target || ev.srcElement;
                    let isParent = false; // 是否冒泡到了父级
                    currentAll.forEach(function (current) {
                        while (target !== current && !isParent) {
                            target = target.parentNode;
                            if (target === parent) {
                                isParent = true;
                            }
                        }
                        if (target === current) {
                            fn();
                        }
                    });
                });
            }
        });
    },
    remove(parentElement, currentElement, eventType = 'click') {
        parentElement.removeEventListener(eventType);
    },
};

module.exports = eventDelegate;
