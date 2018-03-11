const getDomArray = require('zhf.get-dom-array');

const eventDelegate = {
    on(parentElement, currentElement, eventType = 'click', fn = function () {
    }) {
        const parent = getDomArray(parentElement)[0];
        const current = getDomArray(currentElement)[0];
        if (parent && current) {
            parent.addEventListener(eventType, function (ev) {
                ev = ev || window.event;
                let target = ev.target || ev.srcElement;
                let isParent = false; // 是否冒泡到了父级
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
        }
    },
    remove(parentElement, currentElement, eventType = 'click') {
        parentElement.removeEventListener(eventType);
    },
};

module.exports = eventDelegate;
