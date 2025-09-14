const AnneeScolaire = require('../models/anneeScolaire');

// GET all
exports.getAllAnnees = async (req, res) => {
  try {
    const annees = await AnneeScolaire.find();
    res.status(200).json(annees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET by ID
exports.getAnneeById = async (req, res) => {
  try {
    const annee = await AnneeScolaire.findById(req.params.id);
    if (!annee) return res.status(404).json({ message: 'Année scolaire non trouvée' });
    res.status(200).json(annee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createAnnee = async (req, res) => {

  try {

    // Si active=true, mettre toutes les autres années sur false
    if (active) {
      await AnneeScolaire.updateMany({ active: true }, { $set: { active: false } });
    }


    const newAnnee = new AnneeScolaire(req.body);
    const savedAnnee = await newAnnee.save();
    res.status(201).json(savedAnnee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateAnnee = async (req, res) => {
  try {
    const updatedAnnee = await AnneeScolaire.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAnnee) return res.status(404).json({ message: 'Année scolaire non trouvée' });
    res.status(200).json(updatedAnnee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteAnnee = async (req, res) => {
  try {
    const deleted = await AnneeScolaire.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Année scolaire non trouvée' });
    res.status(200).json({ message: 'Année scolaire supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Créer une nouvelle année
export const createAnnee = async (req, res) => {
  try {
    const { libelle, dateDebut, dateFin, active } = req.body;

    if (active) {
      await AnneeScolaire.updateMany(
        { active: true },
        { $set: { active: false, statut: "Inactive" } }
      );
    }

    const nouvelleAnnee = new AnneeScolaire({
      libelle,
      dateDebut,
      dateFin,
      active,
      statut: active ? "Active" : "Inactive",
    });

    await nouvelleAnnee.save();
    res.status(201).json(nouvelleAnnee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la création de l'année scolaire" });
  }
};

// Récupérer toutes les années
export const getAllAnnees = async (req, res) => {
  try {
    const annees = await AnneeScolaire.find().sort({ dateDebut: -1 });
    res.json(annees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des années scolaires" });
  }
};

// Récupérer l'année active
export const getActiveAnnee = async (req, res) => {
  try {
    const activeAnnee = await AnneeScolaire.findOne({ active: true });
    if (!activeAnnee) return res.status(404).json({ message: "Aucune année active trouvée" });
    res.json(activeAnnee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération de l'année active" });
  }
};

// Basculer une année en active
export const setActiveAnnee = async (req, res) => {
  try {
    const { id } = req.params;

    const annee = await AnneeScolaire.findById(id);
    if (!annee) return res.status(404).json({ message: "Année scolaire introuvable" });

    await AnneeScolaire.updateMany(
      { active: true },
      { $set: { active: false, statut: "Inactive" } }
    );

    annee.active = true;
    annee.statut = "Active";
    await annee.save();

    res.json({ message: "Année active mise à jour", annee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'année active" });
  }
};

// Mettre à jour une année (libelle, dates)
export const updateAnnee = async (req, res) => {
  try {
    const { id } = req.params;
    const { libelle, dateDebut, dateFin, active } = req.body;

    const annee = await AnneeScolaire.findById(id);
    if (!annee) return res.status(404).json({ message: "Année scolaire introuvable" });

    if (active) {
      await AnneeScolaire.updateMany(
        { active: true },
        { $set: { active: false, statut: "Inactive" } }
      );
    }

    annee.libelle = libelle ?? annee.libelle;
    annee.dateDebut = dateDebut ?? annee.dateDebut;
    annee.dateFin = dateFin ?? annee.dateFin;
    annee.active = active ?? annee.active;
    annee.statut = annee.active ? "Active" : "Inactive";

    await annee.save();
    res.json(annee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'année scolaire" });
  }
};

// Supprimer une année
export const deleteAnnee = async (req, res) => {
  try {
    const { id } = req.params;
    const annee = await AnneeScolaire.findByIdAndDelete(id);
    if (!annee) return res.status(404).json({ message: "Année scolaire introuvable" });
    res.json({ message: "Année supprimée avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la suppression de l'année scolaire" });
  }
};
