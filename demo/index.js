const eventDelegate = require('../dist/index.min');
eventDelegate.on('.wrap', 'click', '.item1', function () {
    console.log('item1', this);
});
eventDelegate.on('.wrap', 'click', '.item2', function () {
    console.log('item2', this);
});
eventDelegate.on('.wrap', 'click', '.item2', function () {
    console.log('item2', this);
});
eventDelegate.on('.wrap', 'click', '.item3', function () {
    console.log('item3', this);
});
eventDelegate.on('.wrap', 'click', '.item3', function () {
    console.log('item3', this);
});
eventDelegate.on('.wrap', 'click', '.item3', function () {
    console.log('item3', this);
});
eventDelegate.off('.wrap', 'click', '.item3'); // 移除
eventDelegate.emit('.wrap', 'click', '.item1'); // 手动触发
