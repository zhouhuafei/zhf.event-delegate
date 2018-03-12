const eventDelegate = require('../dist/index.min');
eventDelegate.on('.wrap', '.item', 'click', function () {
    console.log(this);
});
