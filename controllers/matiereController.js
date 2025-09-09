const Matiere = require('../models/matiere');

// GET all
exports.getAllMatieress = async (req, res) => {
  try {
    const matieres = await Matiere.find();
    res.status(200).json(matieres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAll = async (req, res) => {
  try {
    const matieres = await Matiere.find();
    res.status(200).json(matieres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET by ID
exports.getMatiereById = async (req, res) => {
  try {
    const matiere = await Matiere.findById(req.params.id);
    if (!matiere) return res.status(404).json({ message: 'Matière non trouvée' });
    res.status(200).json(matiere);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createMatiere = async (req, res) => {
  try {
    const newMatiere = new Matiere(req.body);
    const savedMatiere = await newMatiere.save();
    res.status(201).json(savedMatiere);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateMatiere = async (req, res) => {
  try {
    const updatedMatiere = await Matiere.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMatiere) return res.status(404).json({ message: 'Matière non trouvée' });
    res.status(200).json(updatedMatiere);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteMatiere = async (req, res) => {
  try {
    const deletedMatiere = await Matiere.findByIdAndDelete(req.params.id);
    if (!deletedMatiere) return res.status(404).json({ message: 'Matière non trouvée' });
    res.status(200).json({ message: 'Matière supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
