const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  expediteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destinataire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  classeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: false },
  contenu: { type: String, required: true },
  type: { type: String, enum: ['private', 'group'], required: true },
  lu: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
