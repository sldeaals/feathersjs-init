/* eslint-disable no-console */
const logger = require('./logger');
const app = require('./app');

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

if (app.get){
  const port = app.get('port');
  const server = app.listen(port);
  server.on('listening', () =>
    logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
  );
  console.log(`Worker ${process.pid} started`);
}
