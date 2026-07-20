const notificationRouter = require("express").Router();
const NotificationController = require("../controllers/NotificationController");
const ErrorHandlerMiddleware = require("../middlewares/ErrorHandlerMiddleware");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

/**
 * GET /notification/notification - Get notifications with filtering
 * Query params: time (1=Today, 2=Past), page, limit
 */
notificationRouter.get(
  "/notification",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(NotificationController().getNotifications),
  ResponseMiddleware,
);

module.exports = notificationRouter;
