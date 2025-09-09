const mongoose = require('mongoose');

const emploiDuTempsSchema = new mongoose.Schema({
  classeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true },
  jour: { type: String, required: true }, // Lundi, Mardi...
  matieres: [{
    matiereId: { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere' },
    enseignantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant' },
    heureDebut: { type: String },
    heureFin: { type: String }
  }]
});

module.exports = mongoose.model('EmploiDuTemps', emploiDuTempsSchema);
