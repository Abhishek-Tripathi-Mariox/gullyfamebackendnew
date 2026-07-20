const Notification = require("../models/Notification");

module.exports = () => {
  const getNotifications = async (userId, time, page, limit) => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    let dateFilter = {};
    if (time === 1) {
      // Today's notifications
      dateFilter = { createdAt: { $gte: startOfToday } };
    } else if (time === 2) {
      // Past notifications (before today)
      dateFilter = { createdAt: { $lt: startOfToday } };
    }

    const query = { userId, isActive: true, ...dateFilter };
    const skip = (page - 1) * limit;

    const totalNotifications = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      ...query,
      status: "unRead",
    });

    const notifications = await Notification.find(query)
      .select("_id title description status createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return { totalNotifications, unreadCount, notifications };
  };

  const createNotification = async (data) => {
    return Notification.create(data);
  };

  const markAsRead = async (notificationId, userId) => {
    return Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { status: "read" },
      { new: true },
    );
  };

  return {
    getNotifications,
    createNotification,
    markAsRead,
  };
};
