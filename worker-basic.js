import { parentPort, workerData } from "worker_threads";

const msg = `接收到的 workerData: ${workerData}`;

// *傳送訊息給主線程 worker.on('message') 會接收到
parentPort.postMessage(msg);

// *也可以從 worker 裡接收資訊
parentPort.on("message", (msg) => {
  console.log("worker 接收到 main thread 來的訊息:", msg);
  parentPort.close(); // 關閉此 worker
});

// *若只接收一次 可以使用 once
// parentPort.once("message", (msg) => {
//   console.log("worker 接收到 main thread 來的訊息:", msg);
// });

// *關閉時觸發此事件
parentPort.on("close", (code) => {
  console.log("work close.");
});
