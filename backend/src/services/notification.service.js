import Notification from '../models/Notification.model.js';

export const createNotification = async (userId, type, title, message, modelName = null, modelId = null) => {
  const notification = new Notification({
    user: userId,
    type,
    title,
    message,
  });

  if (modelName && modelId) {
    notification.reference = {
      model: modelName,
      id: modelId,
    };
  }

  await notification.save();
  return notification;
};

export const getUserNotifications = async (userId, query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { user: userId };
  if (query.unreadOnly === 'true') {
    filter.isRead = false;
  }

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(filter)
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

export const markAllAsRead = async (userId) => {
  return Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};
