import { Worker } from 'worker_threads';

/**
 * * 參考: https://nodejs.org/api/worker_threads.html
 * * 範例文章參考: https://medium.com/hybrid-maker/%E8%A9%A6%E7%8E%A9%E4%B8%80%E4%B8%8B-nodejs-10-5-0-worker-threads-a6ac7c6dfb8a
 * ! 官方有講到不要在 worker 裡面做 I/O 的事情
 */

/**
 * * 基本測試
 * new Worker(filename, options)
 * 主線程(main):
 * 支線程(worker):
 * 兩者都可以互相接收、傳送資訊
 */

const worker1Data = '11111111111';
const worker2Data = '22222222222';

const worker1 = new Worker(`./worker-basic.js`, { workerData: worker1Data });
const worker2 = new Worker(`./worker-basic.js`, { workerData: worker2Data });

// 向支線程發送訊息
worker1.postMessage('main-message111');
worker2.postMessage('main-message222');

// 接收支線程訊息
worker1.on('message', msg => {
  console.log('worker1 message:', msg);
});

worker2.on('message', msg => {
  console.log('worker2 message:', msg);
});

/**
 * * 產生 兩萬筆 uid
 * * 將全任務放進一個 Array，一個一個 pop() 出來給 work 做
 * * 支線程做完 => 傳送結果給主線程 => 主線程再傳任務給支線程
 */

const taskCount = 100000; // 任務數量
const threadCount = 4; // 支線程數量

const taskList = []; // 工作列表
const threadList = []; // 支線程列表

const uidList = [];

// 單純是做一個任務列表
let index = 1;
while (index <= taskCount) {
  taskList.push(index);
  index++;
}

// 單純是做一個支線程列表
index = 1;
while (index <= threadCount) {
  const thread = new Worker('./worker-generate-uid.js');
  threadList.push(thread);
  index++;
}

for (const thread of threadList) {
  thread.on('message', uid => {
    // 當支線程每完成一次任務時
    uidList.push(uid);

    if (taskList.length > 0) {
      // 當任務清單還有時，繼續傳任務給支線程
      thread.postMessage(taskList.pop());
    } else {
      // 任務全都完成後
      // 傳送一筆訊息，告訴支線程可以關閉了
      thread.postMessage('close');

      if(uidList.length == taskCount) { // 全都結束後，uidList 應有的數量
        console.log(uidList)
      }
    }
  });

  // 第一次傳送
  thread.postMessage(taskList.pop());
}
