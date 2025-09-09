const mongoose = require('mongoose');

const classeSchema = new mongoose.Schema({
  nom: { type: String, required: true }, // ex: CP1, 6èmeA
  niveau: { type: String }, // maternelle, primaire, collège, lycée
  enseignants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant' }],
  effMax:{type:Number,defaut:100, required:true},
  eleves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' }],
  matieres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Matiere' }],
  anneeScolaireId: { type: mongoose.Schema.Types.ObjectId, ref: 'AnneeScolaire' }
});

module.exports = mongoose.model('Classe', classeSchema);
