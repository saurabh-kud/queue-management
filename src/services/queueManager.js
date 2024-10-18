class QueueManager {
  constructor(channel, logger) {
    this.channel = channel;
    this.logger = logger;
    this.data = null;
  }

  async createQueue(userId) {
    try {
      const queueName = `user_queue_${userId}`;
      await this.channel.assertQueue(queueName, { durable: true });
      this.logger.info(`Queue created for user: ${userId}`);
      return queueName;
    } catch (error) {
      this.logger.error(`Error creating queue for user ${userId}:`, error);
      throw new Error("Error creating queue");
    }
  }

  async enqueueRequest(queueName, request) {
    try {
      this.data = await this.channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(request)),
        { persistent: true }
      );
      console.log(this.data);
      this.logger.info(`Request enqueued to ${queueName}`);
    } catch (error) {
      this.logger.error(`Error enqueueing request to ${queueName}:`, error);
      throw new Error("Error enqueueing request");
    }
  }

  async dequeueRequest(queueName) {
    try {
      const message = await this.channel.get(queueName, { noAck: false });
      if (message) {
        const request = JSON.parse(message.content.toString());
        await this.channel.ack(message);
        this.logger.info(`Request dequeued from ${queueName}`);
        console.log("request", request);
        return request;
      }
      return null;
    } catch (error) {
      this.logger.error(`Error dequeuing request from ${queueName}:`, error);
      throw new Error("Error dequeuing request");
    }
  }

  async deleteQueue(queueName) {
    try {
      await this.channel.deleteQueue(queueName);
      this.logger.info(`Queue deleted: ${queueName}`);
    } catch (error) {
      this.logger.error(`Error deleting queue ${queueName}:`, error);
      throw new Error("Error deleting queue");
    }
  }
}

module.exports = QueueManager;
