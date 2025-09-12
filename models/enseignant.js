const mongoose = require('mongoose');

const enseignantSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String },
  email: { type: String, required: true, unique: true },
  matieres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Matiere' }],
  classe: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classe' }],
  photo: { type: String },
  dateEmbauche: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enseignant', enseignantSchema);
