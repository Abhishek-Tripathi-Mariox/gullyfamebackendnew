module.exports = (lang = "en") => {
  const user_already_found = {
    en: "User already found with given username, Try again after new username!",
  };

  const success = {
    en: "success",
  };

  const logout = {
    en: "logout successfully",
  };

  const invalid_token = {
    en: "invalid token",
  };

  const users_list = {
    en: "users list",
  };

  const social_id_missing = {
    en: "social Provider id is missing!",
  };

  const interest_exists = {
    en: "you have added this interest before",
  };

  const user_not_found = {
    en: "user detail not found with given id",
  };

  const forbidden = {
    en: "forbidden",
  };

  const otp_sent = {
    en: "otp send to your register mobile number",
  };

  const otp_verified = {
    en: "login successfully",
  };

  const incorrect_otp = {
    en: "incorrect otp, try again!",
  };

  const status_changed = {
    en: "status changed successfully",
  };

  const password_changed = {
    en: "Password updated successfully. Please login with new password!",
  };

  const incorrect_password = {
    en: "Entered password is incorrect!",
  };

  const invalid_credentials = {
    en: "invalid credentials!",
  };

  return {
    user_already_found: user_already_found[lang],
    success: success[lang],
    logout: logout[lang],
    invalid_token: invalid_token[lang],
    users_list: users_list[lang],
    user_not_found: user_not_found[lang],
    forbidden: forbidden[lang],
    otp_sent: otp_sent[lang],
    otp_verified: otp_verified[lang],
    incorrect_otp: incorrect_otp[lang],
    status_changed: status_changed[lang],
    interest_exists: interest_exists[lang],
    social_id_missing: social_id_missing[lang],
    password_changed: password_changed[lang],
    incorrect_password: incorrect_password[lang],
    invalid_credentials: invalid_credentials[lang],
    category_created: "Category created successfully",
    category_deleted: "Category deleted successfully",
    chatter_id_required: "Chatter user ID is required",
    competition_id_required: "Competition ID is required",
    competition_not_found: "Competition not found",
    reel_id_required: "Reel ID is required",
    reel_not_found: "Reel not found",
    invalid_action_type:
      "Invalid action type. Must be one of: vote, like, save",
    invalid_search_type:
      "Invalid search type. Must be one of: all, users, competitions, reels",
    receiver_and_message_required: "Receiver ID and message are required",
    message_id_and_emoji_required: "Message ID and emoji are required",
    message_not_found: "Message not found",
    message_ids_required: "Message IDs array is required",
    invalid_delete_type:
      "Invalid delete type. Must be one of: for_me, for_everyone",
    sender_id_required: "Sender ID is required",
  };
};
