const mongoose = require('mongoose');

const enseignantSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  matieres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Matiere' }],
  photo: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enseignant', enseignantSchema);
