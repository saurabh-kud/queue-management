const { v4: uuidv4 } = require("uuid");

class RequestHandler {
  constructor(queueManager, logger) {
    this.queueManager = queueManager;
    this.logger = logger;
    this.pendingRequests = new Map();
  }

  async handleRequest(userId, requestData) {
    const requestId = uuidv4();
    // const queueName = `user_queue_${userId}`;
    const queueName = `user_queue`;

    return new Promise(async (resolve, reject) => {
      try {
        // Create a timeout to reject the promise if no response is received
        const timeout = setTimeout(() => {
          this.pendingRequests.delete(requestId);
          reject(new Error("Request timed out"));
        }, 30000); // 30 seconds timeout

        // Store the resolve and reject functions
        this.pendingRequests.set(requestId, { resolve, reject, timeout });

        // Enqueue the request
        await this.queueManager.enqueueRequest(queueName, {
          requestId,
          userId,
          data: requestData,
        });

        this.logger.info(`Request ${requestId} enqueued for user ${userId}`);
      } catch (error) {
        this.pendingRequests.delete(requestId);
        reject(error);
      }
    });
  }

  async handleResponse(response) {
    const { requestId, data, error } = response;
    const pendingRequest = this.pendingRequests.get(requestId);

    if (pendingRequest) {
      clearTimeout(pendingRequest.timeout);
      this.pendingRequests.delete(requestId);

      if (error) {
        pendingRequest.reject(new Error(error));
      } else {
        pendingRequest.resolve(data);
      }
    } else {
      this.logger.warn(`Received response for unknown request ${requestId}`);
    }
  }
}

module.exports = RequestHandler;
