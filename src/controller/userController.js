const asyncHandler = require("express-async-handler");
const users = require("../models/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
//user register
const register = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    res.status(400);
    throw new Error("all field is required");
  }
  //cheking user available in database
  if (await users.findOne({ email })) {
    res.status(403);
    throw new Error("user already exist");
  }
  try {
    const hasedPassword = await bcrypt.hash(password, 10);
    const user = await users.create({
      fullname,
      email,
      password: hasedPassword,
    });
    if (user) {
      const accesstoken = jwt.sign(
        { user: { email: user.email, id: user._id } },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { user: { email: user.email, id: user._id } },
        process.env.REFRESH_SECRET,
        { expiresIn: "1d" }
      );
      logger.info("User created successfully");
      res.status(201).json({
        status: true,
        message: "User created successfully",
        data: {
          id: user.id,
          fullname: user.fullname,
          email: user.email,

          accessToken: accesstoken,
          refreshToken: refreshToken,
        },
      });
    }
  } catch (error) {
    console.log(error);
    logger.error("Error in user creation", error);
    throw new Error(error.message);
  }
});

//user login

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("all field is mandotory");
  }

  const available = await users.findOne({ email });
  if (!available) {
    res.status(404);
    throw new Error("user doesn't exist");
  }
  try {
    if (
      available &&
      (await bcrypt.compare(String(password), available.password))
    ) {
      const accessToken = jwt.sign(
        { user: { email: available.email, id: available._id } },
        process.env.ACCESS_SECRET,
        { expiresIn: "1d" }
      );
      const refreshToken = jwt.sign(
        { user: { email: available.email, id: available._id } },
        process.env.REFRESH_SECRET,
        { expiresIn: "1d" }
      );
      logger.info("User login successfull");
      res.status(200);
      res.json({
        status: true,
        message: "User login successfull",
        data: {
          id: available.id,
          fullname: available.fullname,
          email: available.email,

          accessToken,
          refreshToken,
        },
      });
    } else {
      res.status(401);
      throw new Error("user is Unauthorized");
    }
  } catch (error) {
    logger.error("error in user login", error.message);
    throw new Error(error.message);
  }
});

module.exports = {
  register,
  login,
};
