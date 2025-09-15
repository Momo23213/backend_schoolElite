const FraisScolarite = require('../models/fraisScolarite');
const Classe = require('../models/classe');
const AnneeScolaire = require('../models/anneeScolaire');

// -------------------
// Créer ou mettre à jour les frais scolaires pour une classe et année
// -------------------
exports.createOrUpdateFrais = async (req, res) => {
  try {
    const { classeId, anneeScolaireId, inscription, reinscription, tranche1, tranche2, tranche3 } = req.body;

    // Vérifier que la classe et l'année existent
    const classe = await Classe.findById(classeId);
    const annee = await AnneeScolaire.findById(anneeScolaireId);
    if (!classe || !annee) return res.status(404).json({ message: 'Classe ou année scolaire introuvable' });

    // Vérifier si les frais existent déjà pour cette classe/année
    let frais = await FraisScolarite.findOne({ classeId, anneeScolaireId });

    if (frais) {
      // Mise à jour
      frais.inscription = inscription || frais.inscription;
      frais.reinscription = reinscription || frais.reinscription;
      frais.tranche1 = tranche1 || frais.tranche1;
      frais.tranche2 = tranche2 || frais.tranche2;
      frais.tranche3 = tranche3 || frais.tranche3;
    } else {
      // Création
      frais = new FraisScolarite({
        classeId,
        anneeScolaireId,
        inscription: inscription || 0,
        reinscription: reinscription || 0,
        tranche1: tranche1 || 0,
        tranche2: tranche2 || 0,
        tranche3: tranche3 || 0
      });
    }

    // Montant total calculé automatiquement dans le schema via pre('save')
    await frais.save();
    res.status(200).json({ message: 'Frais scolaires enregistrés', frais });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Récupérer les frais scolaires pour une classe et année
// -------------------
exports.getFraisByClasseAnnee = async (req, res) => {
  try {
    const { classeId, anneeScolaireId } = req.params;

    const frais = await FraisScolarite.findOne({ classeId, anneeScolaireId })
      .populate('classeId', 'nom niveau')
      .populate('anneeScolaireId');

    if (!frais) return res.status(404).json({ message: 'Frais scolaires introuvables' });

    res.status(200).json({ frais });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Récupérer tous les frais scolaires
// -------------------
exports.getAllFrais = async (req, res) => {
  try {
    const frais = await FraisScolarite.find()
      .populate('classeId', 'nom niveau')
      .populate('anneeScolaireId',"libelle");

    res.status(200).json(frais);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
