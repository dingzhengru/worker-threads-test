import { nanoid } from 'nanoid';
import { parentPort, workerData } from 'worker_threads';

parentPort.on('message', task => {
  if (task == '任務結束') {
    parentPort.close();
    return;
  }
  const uid = nanoid();
  parentPort.postMessage(uid);
});
