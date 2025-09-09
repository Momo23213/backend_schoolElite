const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' },
  matiereId: { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere' },
  enseignantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant' },
  valeur: { type: Number, required: true },
  trimestre: { type: String },
  sequence: { type: String },
  anneeScolaireId: { type: mongoose.Schema.Types.ObjectId, ref: 'AnneeScolaire' }
});

module.exports = mongoose.model('Note', noteSchema);
