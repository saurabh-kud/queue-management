const express = require("express");
const auth = require("../middleware/auth");

function createRequestRouter(requestHandler) {
  const router = express.Router();

  router.get("/process", auth, async (req, res, next) => {
    try {
      const userId = new Date().getTime();
      const requestData = req.body;

      const result = await requestHandler.handleRequest(userId, requestData);
      result["status"] = true;
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = createRequestRouter;
