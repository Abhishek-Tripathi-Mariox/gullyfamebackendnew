const userRouter = require("express").Router();
const UserController = require("../controllers/UserController");
const HomeScreenController = require("../controllers/HomeScreenController");
const CategoryController = require("../controllers/CategoryController");
const ChampionController = require("../controllers/ChampionController");
const CompetitionController = require("../controllers/CompetitionController");
const ErrorHandlerMiddleware = require("../middlewares/ErrorHandlerMiddleware");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const UsersValidator = require("../validators/UsersValidator");

userRouter.get(
  "/profile",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(UserController().getDetails),
  ResponseMiddleware,
);

/**
 * Edit
 */
userRouter.put(
  "/profile",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(UserController().editUser),
  ResponseMiddleware,
);

/**
 * Notifications
 */

userRouter.get(
  "/notifications/switch",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(UserController().activateDeactivateNotification),
  ResponseMiddleware,
);

// userRouter.get(
//   "/notifications",
//   AuthMiddleware().verifyUserToken,
//   ErrorHandlerMiddleware(UserController().notifications),
//   ResponseMiddleware
// );

/**
 * Home Screen
 */
userRouter.get(
  "/homeScreen",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(HomeScreenController().homeScreen),
  ResponseMiddleware,
);

/**
 * Categories
 */
userRouter.get(
  "/categories",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(CategoryController().userList),
  ResponseMiddleware,
);

/**
 * Champions — leaderboard of top users by total reel votes
 * Note: route name kept as `champaigns` to match the existing Postman collection.
 */
userRouter.get(
  "/champaigns",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(ChampionController().list),
  ResponseMiddleware,
);

userRouter.get(
  "/champions",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(ChampionController().list),
  ResponseMiddleware,
);

/**
 * My Competitions — competitions the authenticated user has joined or
 * submitted a reel to.
 */
userRouter.get(
  "/competitions",
  AuthMiddleware().verifyUserToken,
  ErrorHandlerMiddleware(CompetitionController().getMine),
  ResponseMiddleware,
);

module.exports = userRouter;
