import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    // console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  // Change this line to your Node.js app entry point.
  require('./app.ts');
}
