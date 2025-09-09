const Paiement = require('../models/paiementScolaire');
const Eleve = require('../models/eleve');

/**
 * Créer un paiement initial (inscription ou réinscription)
 */
exports.creerPaiement = async (req, res) => {
  try {
    const { eleveId, classeId, anneeScolaireId, montantTotal, montantPaye } = req.body;

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
    await paiement.save();

    // Mettre à jour l'élève
    const eleve = await Eleve.findById(eleveId);
    if (eleve) {
      if (!eleve.montantPaye) eleve.montantPaye = 0;
      if (!eleve.montantRestant) eleve.montantRestant = 0;

      eleve.montantPaye += montantPaye;
      eleve.montantRestant += montantRestant;
      eleve.statutPaiement = eleve.montantRestant <= 0 ? 'à jour' : 'en attente';
      await eleve.save();
    }

    res.status(201).json({ message: 'Paiement initial créé', paiement, eleve });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Ajouter un paiement partiel
 */
exports.ajouterPaiement = async (req, res) => {
  try {
    const { eleveId, classeId, anneeScolaireId, typePaiement, montant } = req.body;

    let paiement = await Paiement.findOne({ eleveId, classeId, anneeScolaireId });
    if (!paiement) return res.status(400).json({ message: 'Paiement non initialisé' });

    paiement.paiements.push({ typePaiement, montant, datePaiement: new Date() });
    paiement.montantPaye += montant;
    paiement.montantRestant = paiement.montantTotal - paiement.montantPaye;
    await paiement.save();

    // Mettre à jour l'élève
    const eleve = await Eleve.findById(eleveId);
    if (eleve) {
      eleve.montantPaye += montant;
      eleve.montantRestant -= montant;
      eleve.statutPaiement = eleve.montantRestant <= 0 ? 'à jour' : 'en attente';
      await eleve.save();
    }

    res.status(200).json({ message: 'Paiement ajouté', paiement, eleve });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Récupérer tous les paiements d'un élève
 */
exports.getAllPaiements = async (req, res) => {
  try {

    const paiements = await Paiement.find()
    .populate("anneeScolaireId")
    .populate("classeId")

    res.status(200).json(paiements); 
    // <-- renvoie directement le tableau
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

    const paiements = await Paiement.find({eleveId})
    .populate("anneeScolaireId")
    .populate("classeId")

    res.status(200).json(paiements); 
    // <-- renvoie directement le tableau
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
