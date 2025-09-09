const mongoose = require('mongoose');

const anneeScolaireSchema = new mongoose.Schema({
  libelle: { type: String, required: true }, // ex: 2024-2025
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  statut: { type: Boolean,  default:false },
});

module.exports = mongoose.model('AnneeScolaire', anneeScolaireSchema);
