const Worker = require("./worker");

function initializeWorkers(
  channel,
  logger,
  requestHandler,
  queueName,
  numWorkers = 3
) {
  for (let i = 0; i < numWorkers; i++) {
    const worker = new Worker(channel, logger, requestHandler);
    worker.start(queueName).catch((error) => {
      logger.error("Worker failed to start:", error);
    });
  }
  logger.info(`Initialized ${numWorkers} workers`);
}

module.exports = { initializeWorkers };
