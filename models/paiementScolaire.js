const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
  eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve', required: true },
  classeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true },
  anneeScolaireId: { type: mongoose.Schema.Types.ObjectId, ref: 'AnneeScolaire', required: true },

  montantTotal: { type: Number, required: true }, // frais inscription/reinscription + tranches
  montantPaye: { type: Number, default: 0 },
  montantRestant: { type: Number, default: 0 },

  paiements: [
    {
      typePaiement: { type: String, required: true }, // ex: 'inscription', 'tranche1'
      montant: { type: Number, required: true },
      datePaiement: { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PaiementsScolaire', paiementSchema);
