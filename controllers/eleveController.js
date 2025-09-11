const Eleve = require('../models/eleve');
const path = require('path');
const fs = require('fs');
const genererMatricule = require('../utils/Matricule');


// GET all
exports.getAllEleves = async (req, res) => {
  try {
    const eleves = await Eleve.find().populate('parentId').populate('classeId', 'nom niveau');
    res.status(200).json(eleves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// -------------------
// GET élèves par classe
// -------------------
exports.getElevesByClasse = async (req, res) => {
  try {
    const eleves = await Eleve.find({ classeId: req.params.classeId })
      .populate('classeId', 'nom niveau')
      .populate('parentId', 'nom prenom email')
      .populate('notes')
      .populate('presences');

    res.status(200).json(eleves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET by ID
exports.getEleveById = async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id)
    .populate('classeId', 'nom niveau')
    .populate("parcours.classeId")         // Classe pour chaque parcours
    .populate("parcours.anneeScolaireId");
    if (!eleve) return res.status(404).json({ message: 'Élève non trouvé' });
    res.status(200).json(eleve);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createEleve = async (req, res) => {

  try {
    const {nom, prenom, sexe, dateNaissance, lieuNaissance ,classeId} = req.body;
    let matricule;
    if(!req.file){
      matricule= genererMatricule(prenom,nom,lieuNaissance)
    }else{
      matricule=req.file.filename.slice(0,-4)
    }
    const eleve = new Eleve({
      matricule:matricule,
      nom,
      prenom,
      sexe,
      classeId,
      dateNaissance,
      lieuNaissance,
      profile: req.file ? `/uploads/${req.file.filename}` : "/uploads/profile.png"
    })
    await eleve.save();
    res.status(201).json(eleve);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE
exports.updateEleve = async (req, res) => {
  try {
    const eleveData = req.body;

    if (req.file) {
      eleveData.photo = `/uploads/${req.file.filename}`;
    }

    const updatedEleve = await Eleve.findByIdAndUpdate(req.params.id, eleveData, { new: true });
    if (!updatedEleve) return res.status(404).json({ message: 'Élève non trouvé' });
    res.status(200).json(updatedEleve);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteEleve = async (req, res) => {
  try {
    const deletedEleve = await Eleve.findByIdAndDelete(req.params.id);
    if (!deletedEleve) return res.status(404).json({ message: 'Élève non trouvé' });

    // Supprimer l'image si existe
    if (deletedEleve.photo) {
      const imgPath = path.join(__dirname, '../', deletedEleve.photo);
      fs.unlink(imgPath, err => {});
    }

    res.status(200).json({ message: 'Élève supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
