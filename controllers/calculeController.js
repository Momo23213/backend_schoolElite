const mongoose = require('mongoose');
const Note = require('../models/note');
const Eleve = require('../models/eleve');
const classe = require('../models/classe');

// -------------------
// Moyenne d'un élève par trimestre
// -------------------
exports.getMoyenneTrimestre = async (req, res) => {
  const { eleveId, trimestre } = req.params;
  try {
    const result = await Note.aggregate([
      { $match: { eleveId:new mongoose.Types.ObjectId(eleveId), trimestre } },
      { $group: { _id: '$eleveId', moyenne: { $avg: '$valeur' } } }
    ]);
    console.log(result);
    
    res.status(200).json(result[0] || { eleveId, moyenne: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Moyenne annuelle d'un élève
// -------------------
exports.getMoyenneAnnuelle = async (req, res) => {
  const { eleveId, anneeScolaireId } = req.params;
  try {
    const result = await Note.aggregate([
      { $match: { 
          eleveId: new require('mongoose').Types.ObjectId(eleveId),
          anneeScolaireId: new require('mongoose').Types.ObjectId(anneeScolaireId)
      }},
      { $group: { _id: '$eleveId', moyenneAnnuelle: { $avg: '$valeur' } } }
    ]);

    res.status(200).json(result[0] || { eleveId, moyenneAnnuelle: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Moyenne et rang de tous les élèves d'une classe pour un trimestre
// -------------------
exports.getClasseRangTrimestre = async (req, res) => {
  const { classeId, trimestre } = req.params;

  try {
    // Étape 1 : récupérer tous les élèves de la classe
    const eleves = await Eleve.find({ classeId });

    const eleveIds = eleves.map(e => e._id);

    // Étape 2 : calculer la moyenne par élève
    const moyennes = await Note.aggregate([
      { $match: { eleveId: { $in: eleveIds }, trimestre } },
      { $group: { _id: '$eleveId', moyenne: { $avg: '$valeur' } } },
      { $sort: { moyenne: -1 } } // tri décroissant
    ]);

    // Étape 3 : attribuer le rang (gestion ex-aequo)
    let rang = 1;
    let lastMoyenne = null;
    let occurrences = 0;
    const result = moyennes.map((item, index) => {
      if (lastMoyenne === item.moyenne) {
        occurrences++;
      } else {
        rang += occurrences;
        occurrences = 1;
      }
      lastMoyenne = item.moyenne;
      return { eleveId: item._id, moyenne: item.moyenne, rang };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Moyenne annuelle et rang pour la classe
// -------------------
exports.getClasseRangAnnuelle = async (req, res) => {
  const { classeId, anneeScolaireId } = req.params;

  try {
    const eleves = await Eleve.find({ classeId });
    const eleveIds = eleves.map(e => e._id);

    const moyennes = await Note.aggregate([
      { $match: { eleveId: { $in: eleveIds }, anneeScolaireId: new require('mongoose').Types.ObjectId(anneeScolaireId) } },
      { $group: { _id: '$eleveId', moyenneAnnuelle: { $avg: '$valeur' } } },
      { $sort: { moyenneAnnuelle: -1 } }
    ]);

    // Calcul des rangs avec ex-aequo
    let rang = 1;
    let lastMoyenne = null;
    let occurrences = 0;
    const result = moyennes.map((item, index) => {
      if (lastMoyenne === item.moyenneAnnuelle) {
        occurrences++;
      } else {
        rang += occurrences;
        occurrences = 1;
      }
      lastMoyenne = item.moyenneAnnuelle;
      return { eleveId: item._id, moyenne: item.moyenneAnnuelle, rang };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// -------------------
// Liste des élèves avec moyennes + rang par trimestre
// -------------------
exports.getElevesMoyenneTrimestre = async (req, res) => {
  const { classeId, trimestre } = req.params;
      const cla=await classe.find({_id:classeId}).select("eleves")
      console.log(cla.eleves);
      
  try {
    // Étape 1 : récupérer les élèves de la classe
    const eleves = await Eleve.find({ classeId });
    const eleveIds = eleves.map(e => e._id);

    // Étape 2 : calcul des moyennes par élève
    let moyennes = await Note.aggregate([
      { $match: { eleveId: { $in: eleveIds }, trimestre } },
      { $group: { _id: "$eleveId", moyenne: { $avg: "$valeur" } } },
      { $sort: { moyenne: -1 } }
    ]);

    // Étape 3 : gestion des rangs avec ex-aequo
    let rang = 1;
    let lastMoyenne = null;
    let occurrences = 0;

    moyennes = moyennes.map((item) => {
      if (lastMoyenne === item.moyenne) {
        occurrences++;
      } else {
        rang += occurrences;
        occurrences = 1;
      }
      lastMoyenne = item.moyenne;
      return { eleveId: item._id, moyenne: item.moyenne, rang };
    });

    // Étape 4 : peupler les infos élèves
    const result = await Promise.all(
      moyennes.map(async (m) => {
        const eleve = await Eleve.findById(m.eleveId).select("nom prenom matricule");
        return { ...m, eleve };
      })
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Liste des élèves avec moyennes + rang annuel
// -------------------
exports.getElevesMoyenneAnnuelle = async (req, res) => {
  const { classeId, anneeScolaireId } = req.params;

  try {
    const eleves = await Eleve.find({ classeId });
    const eleveIds = eleves.map(e => e._id);

    let moyennes = await Note.aggregate([
      { $match: { 
          eleveId: { $in: eleveIds },
          anneeScolaireId: new mongoose.Types.ObjectId(anneeScolaireId)
      }},
      { $group: { _id: "$eleveId", moyenneAnnuelle: { $avg: "$valeur" } } },
      { $sort: { moyenneAnnuelle: -1 } }
    ]);

    let rang = 1;
    let lastMoyenne = null;
    let occurrences = 0;

    moyennes = moyennes.map((item) => {
      if (lastMoyenne === item.moyenneAnnuelle) {
        occurrences++;
      } else {
        rang += occurrences;
        occurrences = 1;
      }
      lastMoyenne = item.moyenneAnnuelle;
      return { eleveId: item._id, moyenne: item.moyenneAnnuelle, rang };
    });

    const result = await Promise.all(
      moyennes.map(async (m) => {
        const eleve = await Eleve.findById(m.eleveId).select("nom prenom matricule");
        return { ...m, eleve };
      })
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
