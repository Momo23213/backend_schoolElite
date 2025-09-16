const express = require('express');
const router = express.Router();
const Eleve = require('../models/eleve');
const auth = require('../middleware/auth');

// GET /api/eleves - Récupérer tous les élèves
router.get('/', auth, async (req, res) => {
  try {
    const eleves = await Eleve.find()
      .populate('classe', 'nom niveau')
      .populate('anneeScolaire', 'annee')
      .sort({ nom: 1 });
    
    res.json(eleves);
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des élèves' });
  }
});

// GET /api/eleves/:id - Récupérer un élève par ID
router.get('/:id', auth, async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id)
      .populate('classe', 'nom niveau')
      .populate('anneeScolaire', 'annee');
    
    if (!eleve) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }
    
    res.json(eleve);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'élève:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'élève' });
  }
});

// POST /api/eleves - Créer un nouvel élève
router.post('/', auth, async (req, res) => {
  try {
    const nouvelEleve = new Eleve(req.body);
    const eleve = await nouvelEleve.save();
    
    const elevePopule = await Eleve.findById(eleve._id)
      .populate('classe', 'nom niveau')
      .populate('anneeScolaire', 'annee');
    
    res.status(201).json(elevePopule);
  } catch (error) {
    console.error('Erreur lors de la création de l\'élève:', error);
    res.status(400).json({ message: 'Erreur lors de la création de l\'élève', error: error.message });
  }
});

// PUT /api/eleves/:id - Mettre à jour un élève
router.put('/:id', auth, async (req, res) => {
  try {
    const eleve = await Eleve.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('classe', 'nom niveau')
      .populate('anneeScolaire', 'annee');
    
    if (!eleve) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }
    
    res.json(eleve);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'élève:', error);
    res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'élève', error: error.message });
  }
});

// DELETE /api/eleves/:id - Supprimer un élève
router.delete('/:id', auth, async (req, res) => {
  try {
    const eleve = await Eleve.findByIdAndDelete(req.params.id);
    
    if (!eleve) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }
    
    res.json({ message: 'Élève supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'élève:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'élève' });
  }
});

// GET /api/eleves/classe/:classeId - Récupérer les élèves d'une classe
router.get('/classe/:classeId', auth, async (req, res) => {
  try {
    const eleves = await Eleve.find({ classe: req.params.classeId })
      .populate('classe', 'nom niveau')
      .populate('anneeScolaire', 'annee')
      .sort({ nom: 1 });
    
    res.json(eleves);
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves de la classe:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des élèves de la classe' });
  }
});

module.exports = router;
