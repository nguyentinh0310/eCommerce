import mongoose from 'mongoose'; 
import * as os from 'os';

export async function countConnections() {
  const numConnections = mongoose.connect.length;
  console.log('Number of connections:', numConnections);

  return numConnections;
}

// kiểm tra memory có bị overload hay không?
export function checkOverLoad() {
  setInterval(() => {
    const numConnection = mongoose.connect.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // số lượng kết nối tối đa dựa trên số core
    const maxConnections = numCores * 5;
    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
    if (numConnection > maxConnections) {
      console.log('Connection overload detected!');
    }
  }, 5000);
}