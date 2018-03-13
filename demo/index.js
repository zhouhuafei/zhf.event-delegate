const eventDelegate = require('../dist/index.min');
eventDelegate.on('.wrap', 'click', '.item', function () {
    console.log('demo', this);
});
// eventDelegate.on('.wrap', 'mouseover', '.item', function () {
//     console.log('demo', this);
// });
eventDelegate.emit('.wrap', 'click', '.item');
// eventDelegate.off('.wrap', 'mouseover', '.item');
// eventDelegate.off('.wrap', 'click', '.item');

// 移除有bug,移除了全部
// emit有bug,emit不了

