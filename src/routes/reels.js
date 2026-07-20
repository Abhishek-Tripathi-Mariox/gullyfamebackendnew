const reelRouter = require("express").Router();
const FeedController = require("../controllers/FeedController");
const ErrorHandlerMiddleware = require("../middlewares/ErrorHandlerMiddleware");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

/**
 * GET /reels - List reels (newest first), cursor-paginated
 * Query params: cursor (reelId), limit
 */
reelRouter.get(
  "/",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(FeedController().listReels),
  ResponseMiddleware,
);

/**
 * POST /reels/:reelId/action - Toggle action (vote, like, save)
 */
reelRouter.post(
  "/:reelId/action",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(FeedController().toggleAction),
  ResponseMiddleware,
);

module.exports = reelRouter;
