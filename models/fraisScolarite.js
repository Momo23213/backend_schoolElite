const mongoose = require('mongoose');

const fraisScolariteSchema = new mongoose.Schema({
  classeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true },
  anneeScolaireId: { type: mongoose.Schema.Types.ObjectId, ref: 'AnneeScolaire', required: true },
  inscription: { type: Number, default: 0 },
  reinscription: { type: Number, default: 0 },
  tranche1: { type: Number, default: 0 },
  tranche2: { type: Number, default: 0 },
  tranche3: { type: Number, default: 0 },
  montantTotal: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Calcul automatique du montant total avant sauvegarde
fraisScolariteSchema.pre('save', function(next) {
  this.montantTotal = this.inscription + this.reinscription + this.tranche1 + this.tranche2 + this.tranche3;
  next();
});

module.exports = mongoose.model('FraisScolarite', fraisScolariteSchema);
