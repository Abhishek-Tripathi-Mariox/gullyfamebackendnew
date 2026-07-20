const NotificationService = require("../services/NotificationService");

module.exports = () => {
  const getNotifications = async (req, res, next) => {
    console.log("NotificationController => getNotifications");
    const { userId } = req.body;
    let time = req.query.time ? parseInt(req.query.time) : 1;
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const { totalNotifications, unreadCount, notifications } =
      await NotificationService().getNotifications(userId, time, page, limit);

    req.rData = {
      page,
      limit,
      time,
      totalNotifications,
      unreadCount,
      notifications,
    };
    req.msg = "success";
    next();
  };

  return { getNotifications };
};
