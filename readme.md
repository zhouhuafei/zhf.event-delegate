# 事件委托
```
const eventDelegate = require('zhf.event-delegate');
   
eventDelegate.on('.wrap', 'click', '.item', function (ev, data) { console.log(this, ev, data); }); // 绑定事件委托
eventDelegate.emit('.wrap', 'click', '.item', {mock: '.item'}); // 手动触发
eventDelegate.off('.wrap', 'click', '.item'); // 移除

eventDelegate.on('.wrap', 'click', function (ev, data) { console.log(this, ev, data); }); // 绑定事件
eventDelegate.emit('.wrap', 'click', {mock: '.wrap'}); // 手动触发
eventDelegate.off('.wrap', 'click'); // 移除
```
