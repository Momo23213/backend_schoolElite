const EmploiDuTemps = require('../models/emploiDuTemps');

// GET all
exports.getAllEmplois = async (req, res) => {
  try {
    const emplois = await EmploiDuTemps.find().populate('classeId').populate('horaires.matiereId').populate('horaires.enseignantId');
    res.status(200).json(emplois);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET by ID
exports.getEmploiById = async (req, res) => {
  try {
    const emploi = await EmploiDuTemps.findById(req.params.id).populate('classeId').populate('horaires.matiereId').populate('horaires.enseignantId');
    if (!emploi) return res.status(404).json({ message: 'Emploi du temps non trouvé' });
    res.status(200).json(emploi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET par classe et année
exports.getEmploiByClasseAnnee = async (req, res) => {
  try {
    const emplois = await EmploiDuTemps.find({
      classeId: req.params.classeId,
      anneeScolaireId: req.params.anneeScolaireId
    }).populate('horaires.matiereId').populate('horaires.enseignantId');
    res.status(200).json(emplois);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createEmploi = async (req, res) => {
  try {
    const newEmploi = new EmploiDuTemps(req.body);
    const savedEmploi = await newEmploi.save();
    res.status(201).json(savedEmploi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateEmploi = async (req, res) => {
  try {
    const updatedEmploi = await EmploiDuTemps.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmploi) return res.status(404).json({ message: 'Emploi du temps non trouvé' });
    res.status(200).json(updatedEmploi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteEmploi = async (req, res) => {
  try {
    const deletedEmploi = await EmploiDuTemps.findByIdAndDelete(req.params.id);
    if (!deletedEmploi) return res.status(404).json({ message: 'Emploi du temps non trouvé' });
    res.status(200).json({ message: 'Emploi du temps supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
