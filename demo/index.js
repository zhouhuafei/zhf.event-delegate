const eventDelegate = require('../dist/index.min');
eventDelegate.on('.wrap', 'click', '.item', function () {
    console.log('demo', this);
});
