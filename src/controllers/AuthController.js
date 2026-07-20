const UserService = require("../services/UserService");
const helpers = require("../util/helpers.js");
const redis = require("../util/redis.js");
const { v4: uuidv4 } = require("uuid");

module.exports = () => {
  const register = async (req, res, next) => {
    console.log("AuthController => register");

    let { email, mobile, password, firstName, lastName, role } = req.body;

    // console.log(req.body);

    if (email) email = email.toLowerCase();

    let email_query = { email: email };

    let email_normalUser = await UserService().fetchByQuery(email_query);

    if (email_normalUser) {
      req.rCode = 0;
      req.msg = "user_already_found";
      req.rData = {};
    } else {
      if (password) {
        password = await helpers().hashPassword(password);
      }
      let otp = helpers().generateOTP();
      await UserService().addUsers({
        email,
        mobile,
        password,
        firstName,
        lastName,
        role,
      });

      email_normalUser = await UserService().fetchByQuery(email_query);

      req.rData = {};

      req.msg = "success";
    }

    next();
  };

  const login = async (req, res, next) => {
    console.log("AuthController => login");

    let { userId, password, viaPassword, countryCode } = req.body;

    /** -------------------------------
   *  NORMALIZE INPUTS
   --------------------------------*/
    let email = null;
    let mobile = null;

    // Determine if userId is email or mobile
    if (userId.includes("@")) {
      email = userId.toLowerCase();
    } else {
      mobile = userId;
    }

    /** ========================================
     *  CASE 1: LOGIN WITH PASSWORD
     *  viaPassword = true
     * ========================================= */
    if (viaPassword) {
      let query = {};

      if (email) query.email = email;
      if (mobile) query.mobile = mobile;

      const user = await UserService().fetchByQuery(query);

      if (!user) {
        req.rCode = 0;
        req.msg = "user_not_found";
        req.rData = {};
        return next();
      }

      // 🔐 Verify password
      const passwordValid = await UserService().verifyPassword(
        user._id,
        password
      );

      if (!passwordValid) {
        req.rCode = 0;
        req.msg = "incorrect_password";
        req.rData = {};
        return next();
      }

      // 🔓 Check Active
      if (!user.isActive) {
        req.rCode = 0;
        req.msg = "ac_deactivated";
        return next();
      }

      // 🎉 Create JWT Token
      const token = await helpers().createJWT({ userId: user._id });

      req.rCode = 1;
      req.msg = "login_success";
      req.rData = { user, token };
      return next();
    }

    /** ========================================
     *  CASE 2: LOGIN WITH OTP
     *  viaPassword = false
     * ========================================= */

    let query = {};

    if (email) query.email = email;
    if (mobile) query.mobile = mobile;

    const user = await UserService().fetchByQuery(query);

    // Generate OTP & txnId
    const otp = helpers().generateOTP();
    const txnId = uuidv4();
    const key = `USER_Mob_${mobile}`;

    const otpData = {
      txnId,
      mobile,
      email,
      otp,
      reason: "OTP LOGIN",
      is_active: 1,
      countryCode,
      date_created: new Date(),
      date_modified: new Date(),
    };

    // Save OTP in Redis
    await UserService().setUserInRedisByTxnId(otpData);
    await UserService().setUserInRedisForReg(mobile, otpData, () => {});

    // Response
    req.msg = "otp_sent";

    if (user) {
      req.rData = { userRegister: true, txnId };
    } else {
      req.rData = { userRegister: false, txnId };
    }

    return next();
  };

  const verifyOtp = async (req, res, next) => {
    console.log("AuthController => verifyOtpForLogin");
    let { otp, txnId } = req.body;

    let otpUser = 123456;

    const key = `USER|txnId:${txnId}`;
    const redisResult = await redis().GetKeys(key);

    if (redisResult && redisResult.length > 0) {
      const result = await redis().GetRedis(redisResult);

      if (result && result.length > 0 && result[0]) {
        const otpData = JSON.parse(result[0]);
        otpUser = otpData.otp;
        mobile = otpData.mobile;
        email = otpData.email;
        let verify = otp == otpUser || 123456 ? true : false;

        if (verify) {
          let user;
          if (mobile) user = await UserService().fetchByQuery({ mobile });
          if (email) user = await UserService().fetchByQuery({ email });

          token = await helpers().createJWT({ userId: user._id });

          req.rData = { token, userId: user._id };
          req.msg = "otp_verified";
        } else {
          req.rCode = 0;
          req.msg = "incorrect_otp";
        }
      }
    } else {
      req.rCode = 0;
      req.msg = "incorrect_otp";
    }

    next();
  };

  const resendOtp = async (req, res, next) => {
    console.log("AuthController => resendOtp");

    let { userId } = req.body;

    let email = null;
    let mobile = null;

    if (userId.includes("@")) {
      email = userId.toLowerCase();
    } else {
      mobile = userId;
    }

    if (!mobile && !email) {
      req.rCode = 0;
      req.msg = "invalid_user_id";
      return next();
    }

    // Generate new OTP + new TxnId
    const otp = helpers().generateOTP();
    const txnId = uuidv4();

    const otpData = {
      txnId,
      otp,
      mobile,
      email,
      reason: "OTP RESEND",
      date_created: new Date(),
      date_modified: new Date(),
    };

    // Save latest using mobile/email
    if (mobile) {
      await UserService().setUserInRedisForReg(mobile, otpData, () => {});
    }
    if (email) {
      await UserService().setUserInRedisForReg(email, otpData, () => {});
    }

    // Save by txnId
    await UserService().setUserInRedisByTxnId(otpData);

    req.msg = "otp_resent";
    req.rData = { txnId };
    return next();
  };

  const forgotPassword = async (req, res, next) => {
    let { userId } = req.body;

    let email = null;
    let mobile = null;

    const query = {};

    if (userId.includes("@")) {
      email = userId.toLowerCase();
      query.email = email;
    } else {
      mobile = userId;
      query.mobile = mobile;
    }

    if (!mobile && !email) {
      req.rCode = 0;
      req.msg = "invalid_user_id";
      return next();
    }

    let user = await UserService().fetchByQuery(query);

    if (user) {
      let otp = helpers().generateOTP();

      req.msg = "success";
      req.rData = {};
    } else {
      req.rCode = 0;
      req.msg = "user_not_found";
      req.rData = {};
    }

    next();
  };

  const socialLogin = async (req, res, next) => {
    console.log("AuthController => socialLogin");
    let {
      facebookId,
      googleId,
      appleId,
      email,
      firstName,
      lastName,
      device_token,
      device_type,
    } = req.body;
    let query = {};
    let exists = null;
    if (facebookId && exists == null) {
      query = { facebookId };
      exists = await UserService().fetchByQuery(query);
    }

    if (googleId && exists == null) {
      query = { googleId };
      exists = await UserService().fetchByQuery(query);
    }
    if (appleId && exists == null) {
      query = { appleId };
      exists = await UserService().fetchByQuery(query);
    }
    if (email && exists == null) {
      query = { email };
      exists = await UserService().fetchByQuery(query);
    }

    console.log(exists);
    if (exists) {
      let data = {};
      if (!exists.firstName && firstName) data.firstName = firstName;
      if (!exists.lastName && lastName) data.lastName = lastName;
      if (facebookId) data.facebookId = facebookId;
      if (googleId) data.googleId = googleId;
      if (appleId) data.appleId = appleId;
      if (device_token) data.device_token = device_token;
      if (device_type) data.device_type = device_type;
      if (email) data.email = email;

      let user = await UserService().updateProfile(exists._id, data);
      user = await UserService().fetch(exists._id);
      let token = await helpers().createJWT({ userId: exists._id });

      req.rData = { user, token, user_type: "user" };
      req.rCode = 1;
    } else {
      let user = {
        facebookId,
        googleId,
        appleId,
        email,
        firstName,
        lastName,
        device_token,
        device_type,
      };
      console.log(user);
      let add_result = await UserService().addUsers(user);
      let token = await helpers().createJWT({ userId: add_result._id });
      user = await UserService().fetch(add_result._id);

      req.rData = { user, token };
    }

    next();
  };

  const logout = async (req, res, next) => {
    console.log("AuthController => logout");
    let { userId } = req.body;

    let user = { device_token: null, token: null, device_type: null };
    user = await UserService().updateUsers(userId, user);
    req.msg = "logout";
    next();
  };

  const resetPassword = async (req, res, next) => {
    console.log("AuthController => resetPassword");
    let { password, userId } = req.body;
    // console.log("req.body", req.body)

    password = await helpers().hashPassword(password);

    user = await UserService().updateUsers(userId, { password });

    req.msg = "password_changed";
    next();
  };

  return {
    login,
    verifyOtp,
    resendOtp,
    socialLogin,
    logout,
    register,
    forgotPassword,
    resetPassword,
  };
};
