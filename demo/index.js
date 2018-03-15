const eventDelegate = require('../dist/index.min');
eventDelegate.on('.wrap', 'click', function () {
    console.log('wrap', this);
});
eventDelegate.on('.wrap', 'click', function () {
    console.log('wrap', this);
});
eventDelegate.on('.wrap', 'click', '.item1', function (ev) {
    console.log('item1', this, ev);
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
eventDelegate.emit('.wrap', 'click'); // 手动触发
eventDelegate.off('.wrap', 'click'); // 移除
eventDelegate.off('.wrap', 'click', '.item3'); // 移除
eventDelegate.emit('.wrap', 'click', '.item1'); // 手动触发
