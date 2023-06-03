const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Event handler for when a worker exits
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Fork a new worker to replace the exited one
    cluster.fork();
  });
} else {
  const express = require('express');
  const app = express();

  // Define your Express routes and middleware here
  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  // Start the Express server
  const server = app.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
