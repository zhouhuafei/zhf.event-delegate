const eventDelegate = require('../dist/index.min');
eventDelegate.on('.wrap', 'click', function (ev, data) {
    console.log('wrap', this, ev, data);
});
eventDelegate.on('.wrap-input', 'blur', '.input-blur', function (ev) {
    console.log('input-blur', this, ev);
});
eventDelegate.on('.wrap', 'click', '.item1', function (ev, data) {
    console.log('item1', this, ev, data);
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
eventDelegate.emit('.wrap', 'click', {mock: '.wrap'}); // 手动触发
// eventDelegate.off('.wrap', 'click'); // 移除
// eventDelegate.off('.wrap', 'click', '.item3'); // 移除
eventDelegate.emit('.wrap', 'click', '.item1', {mock: '.item1'}); // 手动触发
