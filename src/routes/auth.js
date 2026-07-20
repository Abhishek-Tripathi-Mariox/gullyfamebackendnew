const express = require("express");
const authRouter = express.Router();
const AuthValidator = require("../validators/AuthValidator");
const AuthController = require("../controllers/AuthController");
const ErrorHandlerMiddleware = require("../middlewares/ErrorHandlerMiddleware");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
// const UserController = require("../controllers/UserController");

authRouter.post(
  "/register",
  AuthValidator().validateUserRegister,
  ErrorHandlerMiddleware(AuthController().register),
  ResponseMiddleware
);

authRouter.post(
  "/login/social",
  AuthMiddleware().socialLoginValidator,
  ErrorHandlerMiddleware(AuthController().socialLogin),
  ResponseMiddleware
);

authRouter.post(
  "/login",
  AuthValidator().validateLogin,
  ErrorHandlerMiddleware(AuthController().login),
  ResponseMiddleware
);

authRouter.post(
  "/verifyOtp",
  AuthValidator().validateOtp,
  ErrorHandlerMiddleware(AuthController().verifyOtp),
  ResponseMiddleware
);

authRouter.post(
  "/resendOtp",
  AuthValidator().validateLogin,
  ErrorHandlerMiddleware(AuthController().resendOtp),
  ResponseMiddleware
);

authRouter.post(
  "/forgot-password",
  AuthValidator().validateForgotPassword,
  ErrorHandlerMiddleware(AuthController().forgotPassword),
  ResponseMiddleware
);

// authRouter.put(
//   "/updateDeviceToken",
//   AuthMiddleware().verifyUserToken,
//   ErrorHandlerMiddleware(UserController().updateDeviceToken),
//   ResponseMiddleware
// );

// authRouter.get(
//   "/logout",
//   AuthMiddleware().verifyUserToken,
//   ErrorHandlerMiddleware(AuthController().logout),
//   ResponseMiddleware
// );

authRouter.put(
  "/reset-password",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(AuthController().resetPassword),
  ResponseMiddleware
);

module.exports = authRouter;
