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
                    if (target === parent) {
                        isParent = true;
                    }
                    currentAll.forEach(function (current) {
                        while (target !== current && !isParent) {
                            target = target.parentNode;
                            if (target === parent) {
                                isParent = true;
                            }
                            console.log(target);
                        }
                        if (target === current) {
                            fn.call(target);
                        }
                    });
                });
            }
        });
    },
    remove(parentElement, eventType = 'click') {
        // 这个移除是无效的
        parentElement.removeEventListener(eventType);
    },
};

module.exports = eventDelegate;
