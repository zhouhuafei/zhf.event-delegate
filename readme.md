# 事件委托
```
const eventDelegate = require('zhf.event-delegate');
eventDelegate('.wrap', '.item', 'click', function () {
    console.log(this);
});
```
