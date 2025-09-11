const mongoose = require('mongoose');

const eleveSchema = new mongoose.Schema({
  matricule: { type: String, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  dateNaissance: { type: Date,required: true },
  lieuNaissance: { type: String,required: true },
  sexe: { type: String,required: true,enum:['F',"M"] },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fraisId: { type: mongoose.Schema.Types.ObjectId, ref: 'FraisScolarite' },
  classeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe', required: true },
  parcours: [
    {
      classeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe' },
      anneeScolaireId: { type: mongoose.Schema.Types.ObjectId, ref: 'AnneeScolaire' },
      dateInscription: { type: Date, default: Date.now },
      dateSortie: { type: Date }, // remplie si l'élève change de classe
      typeInscription: { type: String, enum: ['nouveau', 'redoublant', 'reinscrit'], default: 'nouveau' }
    }
  ],
  statut: { type: String, enum: ['inscrit', 'reinscrit', 'sorti'], default: 'inscrit' },
  photo: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Eleve', eleveSchema);
