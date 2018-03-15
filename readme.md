# 事件委托
```
const eventDelegate = require('zhf.event-delegate');

eventDelegate.on('.wrap', '.item', 'click', function () {console.log(this);}); // 绑定事件委托
eventDelegate.emit('.wrap', '.item', 'click'); // 手动触发
eventDelegate.off('.wrap', '.item', 'click'); // 移除
```
