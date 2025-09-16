const Message = require('../models/message');
const User = require('../models/user');

// -------------------
// GET messages de groupe par classe
// -------------------
exports.getGroupMessages = async (req, res) => {
  const { classeId } = req.params;

  try {
    const messages = await Message.find({ 
      classeId: classeId,
      type: 'group'
    })
      .populate('expediteur', 'nom prenom photo')
      .sort({ createdAt: 1 });

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
      type: 'private',
      $or: [
        { expediteur: user1, destinataire: user2 },
        { expediteur: user2, destinataire: user1 }
      ]
    })
      .populate('expediteur', 'nom prenom photo')
      .populate('destinataire', 'nom prenom photo')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// POST envoyer un message privé
// -------------------
exports.sendPrivateMessage = async (req, res) => {
  try {
    const { expediteur, destinataire, contenu } = req.body;
    
    const newMessage = new Message({
      expediteur,
      destinataire,
      contenu,
      type: 'private'
    });
    
    const savedMessage = await newMessage.save();
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('expediteur', 'nom prenom photo')
      .populate('destinataire', 'nom prenom photo');
    
    // Émettre via Socket.IO
    const io = req.app.get('io');
    if (io) {
      const roomName = [expediteur, destinataire].sort().join('_');
      io.to(roomName).emit('receive_message', populatedMessage);
    }
    
    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// POST envoyer un message de groupe
// -------------------
exports.sendGroupMessage = async (req, res) => {
  try {
    const { expediteur, classeId, contenu } = req.body;
    
    const newMessage = new Message({
      expediteur,
      classeId,
      contenu,
      type: 'group'
    });
    
    const savedMessage = await newMessage.save();
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('expediteur', 'nom prenom photo');
    
    // Émettre via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(`class_${classeId}`).emit('receive_message', populatedMessage);
    }
    
    res.status(201).json(populatedMessage);
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
// GET conversations d'un utilisateur
// -------------------
exports.getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Récupérer les derniers messages privés
    const conversations = await Message.aggregate([
      {
        $match: {
          type: 'private',
          $or: [{ expediteur: userId }, { destinataire: userId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$expediteur', userId] },
              '$destinataire',
              '$expediteur'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      }
    ]);
    
    // Populer les informations des utilisateurs
    const populatedConversations = await User.populate(conversations, {
      path: '_id',
      select: 'nom prenom photo'
    });
    
    const formattedConversations = populatedConversations.map(conv => ({
      _id: conv._id._id,
      participants: [conv._id],
      lastMessage: conv.lastMessage,
      type: 'private'
    }));
    
    res.status(200).json(formattedConversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// PUT marquer comme lu
// -------------------
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId, userId } = req.body;
    
    await Message.updateMany(
      {
        $or: [
          { expediteur: conversationId, destinataire: userId },
          { classeId: conversationId }
        ],
        lu: false
      },
      { lu: true }
    );
    
    res.status(200).json({ message: 'Messages marqués comme lus' });
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
      { contenu: req.body.contenu },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Message non trouvé" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
