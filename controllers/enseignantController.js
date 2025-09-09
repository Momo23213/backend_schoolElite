const Enseignant = require('../models/enseignant');
const path = require('path');
const fs = require('fs');

// GET all
exports.getAllEnseignants = async (req, res) => {
  try {
    const enseignants = await Enseignant.find().populate('matieres');
    res.status(200).json(enseignants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET by ID
exports.getEnseignantById = async (req, res) => {
  try {
    const enseignant = await Enseignant.findById(req.params.id).populate('matieres');
    if (!enseignant) return res.status(404).json({ message: 'Enseignant non trouvé' });
    res.status(200).json(enseignant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createEnseignant = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.photo = `/uploads/${req.file.filename}`;

    const newEnseignant = new Enseignant(data);
    const savedEnseignant = await newEnseignant.save();
    res.status(201).json(savedEnseignant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateEnseignant = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.photo = `/uploads/${req.file.filename}`;

    const updatedEnseignant = await Enseignant.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updatedEnseignant) return res.status(404).json({ message: 'Enseignant non trouvé' });
    res.status(200).json(updatedEnseignant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteEnseignant = async (req, res) => {
  try {
    const deleted = await Enseignant.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Enseignant non trouvé' });

    if (deleted.photo) {
      const imgPath = path.join(__dirname, '../', deleted.photo);
      fs.unlink(imgPath, err => {});
    }

    res.status(200).json({ message: 'Enseignant supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
