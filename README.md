# worker-threads-test

```bash
npm install
npm start
```

## 筆記
* 主線程、支線程都可以互相傳送、接收資料
* 接收: thread.on('message')
* 傳送: thread.postMessage(data)
* 支線程關閉需調用 .close() 方法，除非只接收一次資料，就使用 .once 事件接收
