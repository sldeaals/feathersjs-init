const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');

// Cluster from standard nodejs library
const cluster = require('cluster');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const authentication = require('./authentication');

const mongoose = require('./mongoose');

const swagger = require('feathers-swagger');

// Cluster from standard nodejs library

// Count the machine's CPUs
const CLUSTER_COUNT = 1;//require('os').cpus().length;
const workers = [];

const init = () => {
  let tempApp = undefined;
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    
    // Create a worker for each CPU
    for (let i = 0; i < CLUSTER_COUNT; i += 1) {
      let worker = cluster.fork(); 
      //listen message from worker
      worker.on('message', function(data) {
        //Broadcast the message
        for (let j in workers) {workers[j].send(data);}
      });
      //Add worker to array
      workers.push(worker);
    }  
    // Start cluster to scale feathers app
    tempApp = cluster;
  }
  
  if (cluster.isWorker) {
    //const worker_id = cluster.worker.id;
    // Main app
    const app = express(feathers());
  
    // Load app configuration
    app.configure(configuration());
  
    // Setup Swagger
    app.configure(swagger({
      docsPath: '/docs',
      uiIndex: true,
      specs: {
        info: {
          title: 'FeathersJS Init',
          description: 'Pilot for any project made with Node.js, Feathers.js, Express.js, and Socket.io. This will help any programmer to quickly start the development of a new application with Javascript.',
          version: '1.0.0'
        }
      },
      ignore: {
        tags: ['authentication']
      }
    }));
    // Enable security, CORS, compression, favicon and body parsing
    app.use(helmet());
    app.use(cors());
    app.use(compress());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
    // Host the public folder
    app.use('/', express.static(app.get('public')));
  
    // Set up Plugins and providers
    app.configure(express.rest());
    app.configure(socketio());
  
    app.configure(mongoose);
  
    // Configure other middleware (see `middleware/index.js`)
    app.configure(middleware);
    app.configure(authentication);
    // Set up our services (see `services/index.js`)
    app.configure(services);
    // Set up event channels (see channels.js)
    app.configure(channels);
  
    // Configure a middleware for 404s and the error handler
    app.use(express.notFound());
    app.use(express.errorHandler({ logger }));
  
    app.hooks(appHooks);
  
    tempApp = app;
  }
  return tempApp
};

const app = init();

module.exports = app;
