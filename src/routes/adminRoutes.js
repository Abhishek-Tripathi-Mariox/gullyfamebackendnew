const adminRouter = require("express").Router();
const AdminController = require("../controllers/AdminController");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");
const ErrorHandlerMiddleware = require("../middlewares/ErrorHandlerMiddleware");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const AdminValidator = require("../validators/AdminValidator");
const CategoryController = require("../controllers/CategoryController");
const UserController = require("../controllers/UserController");
const HomeScreenController = require("../controllers/HomeScreenController");

adminRouter.post(
  "/register",
  ErrorHandlerMiddleware(AdminController().register),
  ResponseMiddleware
);

adminRouter.post(
  "/login",
  AdminValidator().validateAdminLogin,
  ErrorHandlerMiddleware(AdminController().login),
  ResponseMiddleware
);

adminRouter.post(
  "/forgotPassword",
  AdminValidator().validateAdmin,
  ErrorHandlerMiddleware(AdminController().forgotPassword),
  ResponseMiddleware
);

adminRouter.post(
  "/verifyOtp",
  AdminValidator().validateAdmin,
  AdminValidator().validateOtp,
  ErrorHandlerMiddleware(AdminController().verifyOtpForForgotPassword),
  ResponseMiddleware
);

adminRouter.put(
  "/resendOtp",
  AdminValidator().validateAdmin,
  ErrorHandlerMiddleware(AdminController().resendOtpForEmail),
  ResponseMiddleware
);

adminRouter.patch(
  "/resetPassword",
  AuthMiddleware().verifyAdminToken,
  AdminValidator().validateResetPassword,
  ErrorHandlerMiddleware(AdminController().resetPassword),
  ResponseMiddleware
);

adminRouter.patch(
  "/changePassword",
  AuthMiddleware().verifyAdminToken,
  AdminValidator().validateChangePassword,
  ErrorHandlerMiddleware(AdminController().changePassword),
  ResponseMiddleware
);

adminRouter.put(
  "/editProfile",
  AuthMiddleware().verifyAdminToken,
  ErrorHandlerMiddleware(AdminController().editAdmin),
  ResponseMiddleware
);

adminRouter.get(
  "/getDetails",
  AuthMiddleware().verifyAdminToken,
  ErrorHandlerMiddleware(AdminController().getDetails),
  ResponseMiddleware
);

/**
 * Categories
 */

adminRouter.post(
  "/categories",
  AuthMiddleware().verifyAdminToken,
  ErrorHandlerMiddleware(CategoryController().create),
  ResponseMiddleware
);

adminRouter.get(
  "/categories",
  AuthMiddleware().verifyAdminToken,
  ErrorHandlerMiddleware(CategoryController().list),
  ResponseMiddleware
);

adminRouter.delete(
  "/categories/:id",
  ErrorHandlerMiddleware(CategoryController().delete),
  ResponseMiddleware
);

/**
 * Banners
 */

adminRouter.post(
  "/banners",
  AuthMiddleware().verifyAdminToken,
  ErrorHandlerMiddleware(AdminController().addBanner),
  ResponseMiddleware
);

adminRouter.put(
  "/banners/:id",
  AuthMiddleware().verifyAdminToken,
  AdminValidator().validateBannerId,
  ErrorHandlerMiddleware(AdminController().updateBanner),
  ResponseMiddleware
);

adminRouter.get(
  "/banners",
  ErrorHandlerMiddleware(AdminController().getBanner),
  ResponseMiddleware
);

adminRouter.get(
  "/banners/:id",
  AdminValidator().validateBannerId,
  ErrorHandlerMiddleware(AdminController().getBannerDetail),
  ResponseMiddleware
);

adminRouter.delete(
  "/banners/:id",
  AuthMiddleware().verifyAdminToken,
  AdminValidator().validateBannerId,
  ErrorHandlerMiddleware(AdminController().deleteBanner),
  ResponseMiddleware
);

adminRouter.patch(
  "/banners/:id",
  AuthMiddleware().verifyAdminToken,
  AdminValidator().validateBannerId,
  ErrorHandlerMiddleware(AdminController().activateDeactivateBanner),
  ResponseMiddleware
);

/**
 * Category
 */

adminRouter.post(
  "/categories",
  AuthMiddleware().verifyAdminToken,
  AdminValidator().validateCategory,
  ErrorHandlerMiddleware(CategoryController().addCategory),
  ResponseMiddleware
);

adminRouter.get(
  "/categories",
  AuthMiddleware().verifyAdminToken,
  ErrorHandlerMiddleware(CategoryController().getAllCategoryList),
  ResponseMiddleware
);

adminRouter.get(
  "/categories/:id",
  AuthMiddleware().verifyAdminToken,
  AdminValidator().validateCategoryId,
  ErrorHandlerMiddleware(CategoryController().getDetailForAdmin),
  ResponseMiddleware
);

adminRouter.delete(
  "/categories/:id",
  AuthMiddleware().verifyAdminToken,
  AdminValidator().validateCategoryId,
  ErrorHandlerMiddleware(CategoryController().deleteCategory),
  ResponseMiddleware
);

adminRouter.patch(
  "/categories/:id",
  AuthMiddleware().verifyAdminToken,
  AdminValidator().validateCategoryId,
  ErrorHandlerMiddleware(CategoryController().activateDeactivateCategory),
  ResponseMiddleware
);

/**
 * Settings
 */

adminRouter.get(
  "/termAndCondition",
  ErrorHandlerMiddleware(AdminController().getTermAndCondition),
  ResponseMiddleware
);

adminRouter.post(
  "/termAndCondition",
  AuthMiddleware().verifyAdminToken,
  ErrorHandlerMiddleware(AdminController().addTermAndCondition),
  ResponseMiddleware
);

adminRouter.get(
  "/aboutUs",
  ErrorHandlerMiddleware(AdminController().getAboutUs),
  ResponseMiddleware
);

adminRouter.post(
  "/aboutUs",
  AuthMiddleware().verifyAdminToken,
  ErrorHandlerMiddleware(AdminController().addAboutUs),
  ResponseMiddleware
);

adminRouter.get(
  "/privacyPolicy",
  ErrorHandlerMiddleware(AdminController().getPrivacyPolicy),
  ResponseMiddleware
);

adminRouter.post(
  "/privacyPolicy",
  AuthMiddleware().verifyAdminToken,
  ErrorHandlerMiddleware(AdminController().addPrivacyPolicy),
  ResponseMiddleware
);

adminRouter.get(
  "/competitionRules",
  ErrorHandlerMiddleware(AdminController().getCompetitionRules),
  ResponseMiddleware
);

adminRouter.post(
  "/competitionRules",
  AuthMiddleware().verifyAdminToken,
  ErrorHandlerMiddleware(AdminController().addCompetitionRules),
  ResponseMiddleware
);

/**
 * contactUs
 */

adminRouter.get(
  "/contactUs",
  ErrorHandlerMiddleware(AdminController().getContactUs),
  ResponseMiddleware
);

adminRouter.post(
  "/contactUs",
  AuthMiddleware().verifyAdminToken,
  ErrorHandlerMiddleware(AdminController().contactUs),
  ResponseMiddleware
);

/**
 * FAQS
 */

adminRouter.post(
  "/faqs",
  AuthMiddleware().verifyAdminToken,
  AdminValidator().validateFAQ,
  ErrorHandlerMiddleware(AdminController().addFaqs),
  ResponseMiddleware
);

adminRouter.get(
  "/faqs",
  ErrorHandlerMiddleware(AdminController().Faqs),
  ResponseMiddleware
);

adminRouter.get(
  "/faqs/:id",
  AdminValidator().validateFAQId,
  ErrorHandlerMiddleware(AdminController().faqsDetail),
  ResponseMiddleware
);

adminRouter.delete(
  "/faqs/:id",
  AuthMiddleware().verifyAdminToken,
  AdminValidator().validateFAQId,
  ErrorHandlerMiddleware(AdminController().deleteFaq),
  ResponseMiddleware
);

adminRouter.patch(
  "/faqs/:id",
  AuthMiddleware().verifyAdminToken,
  AdminValidator().validateFAQId,
  ErrorHandlerMiddleware(AdminController().activateDeactivateFaqs),
  ResponseMiddleware
);

/**
 * Dashboard
 */

adminRouter.get(
  "/dashboard",
  AuthMiddleware().verifyAdminToken,
  ErrorHandlerMiddleware(HomeScreenController().getAdminDashboard),
  ResponseMiddleware
);

// /**
//  * Users
//  */
// adminRouter.post(
//   "/users",
//   AuthMiddleware().verifyAdminToken,
//   AdminValidator().validateUsers,
//   // AuthMiddleware().checkEmailAndMobileToEditProfile,
//   ErrorHandlerMiddleware(UserController().addUser),
//   ResponseMiddleware
// );

// adminRouter.get(
//   "/users",
//   AuthMiddleware().verifyAdminToken,
//   ErrorHandlerMiddleware(UserController().getAllUserListForAdmin),
//   ResponseMiddleware
// );

// adminRouter.get(
//   "/users/:id",
//   AuthMiddleware().verifyAdminToken,
//   AdminValidator().validateUserId,
//   ErrorHandlerMiddleware(UserController().getDetailsForAdmin),
//   ResponseMiddleware
// );

// adminRouter.patch(
//   "/users/:id",
//   AuthMiddleware().verifyAdminToken,
//   AdminValidator().validateUserId,
//   ErrorHandlerMiddleware(UserController().updateStatus),
//   ResponseMiddleware
// );

// adminRouter.delete(
//   "/users/:id",
//   AuthMiddleware().verifyAdminToken,
//   AdminValidator().validateUserId,
//   ErrorHandlerMiddleware(UserController().deleteUser),
//   ResponseMiddleware
// );

module.exports = adminRouter;
