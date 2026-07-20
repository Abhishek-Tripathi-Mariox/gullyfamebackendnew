const userRouter = require("express").Router();
const LogoController = require("../controllers/LogoController");
const ErrorHandlerMiddleware = require("../middlewares/ErrorHandlerMiddleware");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");

userRouter.get(
  "/logo",
  ErrorHandlerMiddleware(LogoController().getAllLogoList),
  ResponseMiddleware
);

userRouter.post(
  "/logo",
  ErrorHandlerMiddleware(LogoController().addLogo),
  ResponseMiddleware
);

userRouter.get(
  "/splash",
  ErrorHandlerMiddleware(LogoController().getSplash),
  ResponseMiddleware
);

module.exports = userRouter;
