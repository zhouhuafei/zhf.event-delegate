const getDomArray = require('zhf.get-dom-array');

const eventDelegate = {
    on(parentElement, currentElement, eventType, fn) {
        const parent = getDomArray(parentElement)[0];
        const current = getDomArray(currentElement)[0];
        if (parent && current) {
            parent.addEventListener('click', function () {

            });
        }
    },
    remove() {
    },
};

module.exports = eventDelegate;
