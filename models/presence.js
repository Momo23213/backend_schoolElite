const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
  eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve', required: true },
  classeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true },
  date: { type: Date, required: true },
  statut: { type: String, enum: ['présent(e)', 'absent(e)', 'retard'], default: 'présent' }
});

module.exports = mongoose.model('Presence', presenceSchema);
