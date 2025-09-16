const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Routes pour les messages privés
router.get('/private/:user1/:user2', messageController.getPrivateMessages);
router.post('/private', messageController.sendPrivateMessage);

// Routes pour les messages de groupe
router.get('/group/:classeId', messageController.getGroupMessages);
router.post('/group', messageController.sendGroupMessage);

// Routes pour les conversations
router.get('/conversations/:userId', messageController.getConversations);

// Marquer comme lu
router.put('/mark-read', messageController.markAsRead);

// CRUD basique
router.put('/:id', messageController.updateMessage);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
