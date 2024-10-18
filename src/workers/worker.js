const QueueManager = require("../services/queueManager");

class Worker {
  constructor(channel, logger, requestHandler) {
    this.queueManager = new QueueManager(channel, logger);
    this.logger = logger;
    this.channel = channel;
    this.requestHandler = requestHandler;
  }

  async start(queueName) {
    try {
      // while (true) {
      //   const request = await this.queueManager.dequeueRequest(queueName);
      //   console.log(request);
      //   if (request) {
      //     await this.processRequest(request);
      //   } else {
      //     // No more requests in the queue, wait for a short time before checking again
      //     await new Promise((resolve) => setTimeout(resolve, 1000));
      //   }
      // }
      this.channel.consume(queueName, async (msg) => {
        if (msg !== null) {
          const response = JSON.parse(msg.content.toString());
          await this.processRequest(response);
          // requestHandler.handleResponse(response);
          this.channel.ack(msg);
        }
      });
    } catch (error) {
      this.logger.error(`Worker error for queue ${queueName}:`, error);
    }
  }

  async processRequest(request) {
    try {
      this.logger.info(`Processing request: ${JSON.stringify(request)}`);

      // Simulating processing time and result
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = {
        message: `Processed request for user ${request.userId}`,
      };

      // Send the response back
      await this.sendResponse(request.requestId, result);

      this.logger.info(
        `Request processed successfully: ${JSON.stringify(request)}`
      );
    } catch (error) {
      this.logger.error(
        `Error processing request: ${JSON.stringify(request)}`,
        error
      );
      // Send error response back
      await this.sendResponse(request.requestId, null, error.message);
    }
  }

  async sendResponse(requestId, data, error = null) {
    try {
      const response = { requestId, data, error };
      this.logger.info(`Response sent for request ${requestId}`);
      return await this.requestHandler.handleResponse(response);
    } catch (error) {
      this.logger.error(
        `Error sending response for request ${requestId}:`,
        error
      );
    }
  }
}

module.exports = Worker;
