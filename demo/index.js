const eventDelegate = require('../dist/index.min');
eventDelegate.on('.wrap', 'click', '.item', function () {
    console.log('demo1', this);
});
eventDelegate.on('.wrap', 'click', '.item', function () {
    console.log('demo2', this);
});
// eventDelegate.on('.wrap', 'mouseover', '.item', function () {
//     console.log('demo', this);
// });
// eventDelegate.off('.wrap', 'click', '.item');
// eventDelegate.emit('.wrap', 'click', '.item');
// eventDelegate.emit('.wrap', 'mouseover', '.item');
// eventDelegate.off('.wrap', 'mouseover', '.item');
// eventDelegate.off('.wrap', 'click', '.item');

// 移除有bug,移除了全部
// emit有bug,emit不了
