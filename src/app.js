const express = require("express");
const amqp = require("amqplib");
const createRequestRouter = require("./routes/request");
const errorHandler = require("./middleware/errorHandler");
const { initializeWorkers } = require("./workers/workerManager");
const QueueManager = require("./services/queueManager");
const RequestHandler = require("./services/requestHandler");
const connectDB = require("./config/database");
const dotenv = require("dotenv");
const promClient = require("prom-client");
const winston = require("winston");

dotenv.config();

// Initialize logger
const logger = require("./config/logger");

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Create a Registry which registers the metrics
const register = new promClient.Registry();

// Enable the collection of default metrics
promClient.collectDefaultMetrics({
  app: "queue-system",
  prefix: "node_",
  timeout: 10000,
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
  register,
});

// Create a custom counter for HTTP requests
const httpRequestsTotal = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

// Create a custom histogram for request duration
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
  registers: [register],
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const duration = process.hrtime(start);
    const durationMs = duration[0] * 1000 + duration[1] / 1e6;

    httpRequestsTotal.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode,
    });
    httpRequestDurationMicroseconds.observe(
      { method: req.method, route: req.path, status: res.statusCode },
      durationMs
    );
  });

  next();
});

app.get("/", (req, res) => {
  res.json({
    msg: "server is working fine🚀🚀",
    api_doc: "https://documenter.getpostman.com/view/38681155/2sAXxWZp2j",
  });
});
// Expose metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

(async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();
    // Ensure the queue is created before consuming from it
    const queueName = "user_queue";
    await channel.assertQueue(queueName, { durable: true });

    const queueManager = new QueueManager(channel, logger);
    const requestHandler = new RequestHandler(queueManager, logger);
    logger.info("Connected to RabbitMQ");

    // Initialize worker processes for consumer
    initializeWorkers(channel, logger, requestHandler, queueName);

    logger.info("Queue user_queue asserted successfully");

    // Routes
    app.use("/", require("./routes/auth"));
    app.use("/", createRequestRouter(requestHandler));

    // Error handling middleware
    app.use(errorHandler);

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error("RabbitMQ connection error:", err);
    process.exit(1);
  }
})();

module.exports = app;
