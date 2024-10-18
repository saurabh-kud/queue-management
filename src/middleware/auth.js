const jwt = require("jsonwebtoken");
const users = require("../models/user");
const asyncHandler = require("express-async-handler");

const auth = asyncHandler(async (req, res, next) => {
  const reqHeader = req.headers.Authorization || req.headers.authorization;

  if (!reqHeader) {
    res.status(401);
    throw new Error("access token is required || Unauthorized");
  }

  if (reqHeader && reqHeader.startsWith("Bearer")) {
    const token = reqHeader.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("access token is required || Unauthorized");
    }
    try {
      const decode = jwt.verify(token, process.env.ACCESS_SECRET);
      if (!decode) {
        res.status(401);
        throw new error("Unauthorized");
      }
      const { email } = decode.user;
      const user = await users.findOne({ email }).select("-password");

      if (user) {
        req.user = user;

        next();
      } else {
        throw new Error("token invalid");
      }
    } catch (error) {
      res.status(401);
      throw new Error("token is invalid");
    }
  }
});

module.exports = auth;
