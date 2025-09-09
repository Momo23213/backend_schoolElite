const Message = require('../models/message');

// -------------------
// GET messages de groupe
// -------------------
exports.getMessagesByRoom = async (req, res) => {
  const { room } = req.params;

  try {
    const messages = await Message.find({ toRoom: room })
      .populate('from', 'nom prenom photo')
      .sort({ createdAt: 1 }); // du plus ancien au plus récent

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// GET messages privés entre 2 utilisateurs
// -------------------
exports.getPrivateMessages = async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 }
      ]
    })
      .populate('from', 'nom prenom photo')
      .populate('to', 'nom prenom photo')
      .sort({ createdAt: 1 }); // du plus ancien au plus récent

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// POST créer un message
// -------------------
exports.createMessage = async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// DELETE message par id
// -------------------
exports.deleteMessage = async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Message non trouvé" });
    res.status(200).json({ message: "Message supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// PUT mettre à jour un message
// -------------------
exports.updateMessage = async (req, res) => {
  try {
    const updated = await Message.findByIdAndUpdate(
      req.params.id,
      { message: req.body.message },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Message non trouvé" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
