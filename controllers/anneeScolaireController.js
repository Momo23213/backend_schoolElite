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
