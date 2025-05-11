import Notification from "../models/Notification.js";



// Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { user, message, date, time, location } = req.body;

    const notification = new Notification({
      user,
      message,
      date,
      time,
    });

    const saved = await notification.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  console.log("Marking all notifications as read for user:", req.params.userId);
  try {
    await Notification.updateMany({ user: req.params.userId, read: false }, { $set: { read: true } });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
