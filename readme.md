# 事件委托
```
const eventDelegate = require('zhf.event-delegate');

eventDelegate.on('.wrap', 'click', '.item', function () {console.log(this);}); // 绑定事件委托
eventDelegate.emit('.wrap', 'click', '.item'); // 手动触发
eventDelegate.off('.wrap', 'click', '.item'); // 移除

eventDelegate.on('.wrap', 'click', function () {console.log(this);}); // 绑定事件
eventDelegate.emit('.wrap', 'click'); // 手动触发
eventDelegate.off('.wrap', 'click'); // 移除
```
