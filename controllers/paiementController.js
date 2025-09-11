const Paiement = require('../models/paiementScolaire');
const Eleve = require('../models/eleve');
const mongoose = require('mongoose');

/**
 * Créer un paiement initial (inscription ou réinscription)
 */
exports.creerPaiement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { eleveId, classeId, anneeScolaireId, montantTotal, montantPaye } = req.body;

    // Validation
    if (!eleveId || !classeId || !anneeScolaireId || montantTotal <= 0 || montantPaye < 0) {
      return res.status(400).json({ message: 'Données invalides' });
    }

    const montantRestant = montantTotal - montantPaye;

    const paiement = new Paiement({
      eleveId,
      classeId,
      anneeScolaireId,
      montantTotal,
      montantPaye,
      montantRestant,
      paiements: [
        { typePaiement: 'initial', montant: montantPaye, datePaiement: new Date() }
      ]
    });
    await paiement.save({ session });

    // Mettre à jour l'élève
    const eleve = await Eleve.findById(eleveId).session(session);
    if (!eleve) {
      throw new Error('Élève introuvable');
    }

    eleve.montantPaye = (eleve.montantPaye || 0) + montantPaye;
    eleve.montantRestant = (eleve.montantRestant || 0) + montantRestant;
    eleve.statutPaiement = eleve.montantRestant <= 0 ? 'à jour' : 'en attente';
    await eleve.save({ session });

    await session.commitTransaction();
    res.status(201).json({ message: 'Paiement initial créé', paiement, eleve });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

/**
 * Ajouter un paiement partiel
 */
exports.ajouterPaiement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { eleveId, classeId, anneeScolaireId, typePaiement, montant } = req.body;

    // Validation
    if (!eleveId || !montant || montant <= 0) {
      return res.status(400).json({ message: 'Données invalides' });
    }

    const paiement = await Paiement.findOne({ eleveId, classeId, anneeScolaireId }).session(session);
    if (!paiement) {
      return res.status(400).json({ message: 'Paiement non initialisé' });
    }

    if (paiement.montantRestant < montant) {
      return res.status(400).json({ message: 'Montant supérieur au restant dû' });
    }

    paiement.paiements.push({ typePaiement, montant, datePaiement: new Date() });
    paiement.montantPaye += montant;
    paiement.montantRestant = paiement.montantTotal - paiement.montantPaye;
    await paiement.save({ session });

    // Mettre à jour l'élève
    const eleve = await Eleve.findById(eleveId).session(session);
    if (eleve) {
      eleve.montantPaye += montant;
      eleve.montantRestant -= montant;
      eleve.statutPaiement = eleve.montantRestant <= 0 ? 'à jour' : 'en attente';
      await eleve.save({ session });
    }

    await session.commitTransaction();
    res.status(200).json({ message: 'Paiement ajouté', paiement, eleve });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

/**
 * Récupérer tous les paiements d'un élève
 */
exports.getAllPaiements = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

   const [paiements, total] = await Promise.all([
  Paiement.find()
    .select("-__v")
    .populate("anneeScolaireId")
    .populate( "eleveId")
    .skip(skip)
    .limit(limit),
  Paiement.countDocuments(),
]);

    res.status(200).json(paiements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
/**
 * Récupérer tous les paiements d'un élève
 */
exports.getAllPaiement = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

   const [paiements, total] = await Promise.all([
  Paiement.find()
    .select("-__v")
    .populate("anneeScolaireId")
    .populate({
      path: "eleveId",
      select: "-parcours",
      populate: [
        {
          path: "classeId",
          model: "Classe",
          select: "nom",
        },
        {
          path: "fraisId",
          model: "FraisScolarite",
          select: "-classeId -anneeScolaireId",
        },
      ],
    })
    .skip(skip)
    .limit(limit),
  Paiement.countDocuments(),
]);

    res.status(200).json(paiements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Récupérer tous les paiements d'un élève
 */
exports.getPaiementsEleve = async (req, res) => {
  try {
    const { eleveId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eleveId)) {
      return res.status(400).json({ message: 'ID élève invalide' });
    }

    const paiements = await Paiement.find({ eleveId })
      .populate('anneeScolaireId')
      .populate('classeId')
      .sort({ createdAt: -1 });

    res.status(200).json(paiements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Récupérer paiement pour une année et classe spécifique
 */
exports.getPaiementParAnneeClasse = async (req, res) => {
  try {
    const { eleveId, classeId, anneeScolaireId } = req.params;
    const paiement = await Paiement.findOne({ eleveId, classeId, anneeScolaireId })
      .populate('classeId', 'nom niveau')
      .populate('anneeScolaireId', 'nomDebut nomFin');

    if (!paiement) return res.status(404).json({ message: 'Paiement introuvable' });

    res.status(200).json({ paiement });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Supprimer un paiement complet pour un élève (et mettre à jour l'élève)
 */
exports.supprimerPaiement = async (req, res) => {
  try {
    const { paiementId } = req.params;
    const paiement = await Paiement.findById(paiementId);
    if (!paiement) return res.status(404).json({ message: 'Paiement introuvable' });

    // Mettre à jour l'élève
    const eleve = await Eleve.findById(paiement.eleveId);
    if (eleve) {
      eleve.montantPaye -= paiement.montantPaye;
      eleve.montantRestant -= paiement.montantRestant;
      eleve.statutPaiement = eleve.montantRestant <= 0 ? 'à jour' : 'en attente';
      await eleve.save();
    }

    await paiement.deleteOne();

    res.status(200).json({ message: 'Paiement supprimé et élève mis à jour', eleve });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
