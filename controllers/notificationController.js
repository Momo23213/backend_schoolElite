const Notification = require('../models/notification');

// GET all
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('destinataireId');
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET par utilisateur
exports.getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ destinataireId: req.params.userId });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createNotification = async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateNotification = async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNotification) return res.status(404).json({ message: 'Notification non trouvée' });
    res.status(200).json(updatedNotification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteNotification = async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
    if (!deletedNotification) return res.status(404).json({ message: 'Notification non trouvée' });
    res.status(200).json({ message: 'Notification supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
