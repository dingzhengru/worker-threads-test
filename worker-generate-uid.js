import { nanoid } from 'nanoid';
import { parentPort, workerData } from 'worker_threads';

parentPort.on('message', task => {
  if (task == 'close') {
    parentPort.close();
    return;
  }
  const uid = nanoid();
  parentPort.postMessage(uid);
});
