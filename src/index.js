/* eslint-disable no-console */
const cluster = require('cluster');
const logger = require('./logger');
// Count the machine's CPUs
const clusterCount = require('os').cpus().length;

const workers = [];

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Create a worker for each CPU
  for (let i = 0; i < clusterCount; i += 1) {
    let worker = cluster.fork(); 
    //listen message from worker
    worker.on('message', function(data) {
      //Broadcast the message
      for (let j in workers) {workers[j].send(data);}
    });
    //Add worker to array
    workers.push(worker);
  }
}

if (cluster.isWorker) {
  console.log(`Worker ${process.pid} started`);

  const app = require('./app');
  
  process.on('unhandledRejection', (reason, p) =>
    logger.error('Unhandled Rejection at: Promise ', p, reason)
  );

  const port = app.get('port');
  const server = app.listen(port);
  server.on('listening', () =>
    logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
  );
}
