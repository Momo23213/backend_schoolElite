// controllers/statistiquesController.js
const Eleve = require("../models/eleve");
const Classe = require("../models/classe");
const Paiement = require("../models/paiementScolaire");
const FraisScolarite = require("../models/fraisScolarite");

exports.getStatistiques = async (req, res) => {
  try {
    // Total d'élèves et de classes
    const totalEleves = await Eleve.countDocuments();
    const totalClasses = await Classe.countDocuments();

    // Toutes les classes avec leurs élèves
    const classes = await Classe.find().populate("eleves");

    // Paiements totaux
    const paiements = await Paiement.find();
    const revenuActuel = paiements.reduce((acc, p) => acc + p.montantPaye, 0);

    // Revenu annuel potentiel
    let revenuAnnuel = 0;
    for (const cls of classes) {
      const frais = await FraisScolarite.findOne({ classeId: cls._id });
      const nbEleves = cls.eleves.length;
      if (frais) {
        revenuAnnuel += frais.montantTotal * nbEleves;
      }
    }

    // Revenu restant
    const revenuRestant = revenuAnnuel - revenuActuel;

    // Préparer les données pour graphiques (exemple: élèves par classe)
    const classesData = classes.map(cls => ({
      id: cls._id,
      nom: cls.nom,
      nbEleves: cls.eleves.length
    }));

    res.status(200).json({
      totalEleves,
      totalClasses,
      revenuAnnuel,
      revenuActuel,
      revenuRestant,
      classes: classesData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur: " + err.message });
  }
};
