const EmploiDuTemps = require("../models/emploiDuTemps");

/**
 * ============================================
 *        CRUD DE BASE SUR EMPLOIS DU TEMPS
 * ============================================
 */

// ✅ Récupérer tous les emplois du temps
exports.getAllEmplois = async (req, res) => {
  try {
    const emplois = await EmploiDuTemps.find()
      .populate("classeId", "nom") // Afficher uniquement le nom de la classe
      .populate("matieres.matiereId", "nom") // Afficher uniquement le nom de la matière
      .populate("matieres.enseignantId", "nom prenom"); // Afficher nom & prénom enseignant
    res.status(200).json(emplois);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Récupérer un emploi par son ID
exports.getEmploiById = async (req, res) => {
  try {
    const emploi = await EmploiDuTemps.findById(req.params.id)
      .populate("classeId", "nom")
      .populate("matieres.matiereId", "nom")
      .populate("matieres.enseignantId", "nom prenom");

    if (!emploi)
      return res.status(404).json({ message: "Emploi du temps non trouvé" });

    res.status(200).json(emploi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Récupérer tous les emplois d’une classe donnée
exports.getEmploiByClasse = async (req, res) => {
  try {
    const emplois = await EmploiDuTemps.find({
      classeId: req.params.classeId,
    })
      .populate("classeId", "nom")
      .populate("matieres.matiereId", "nom")
      .populate("matieres.enseignantId", "nom prenom");

    res.status(200).json(emplois);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Récupérer un emploi d’une classe à un jour précis
exports.getEmploiByClasseAndJour = async (req, res) => {
  try {
    const { classeId, jour } = req.params;
    const emploi = await EmploiDuTemps.findOne({ classeId, jour })
      .populate("classeId", "nom")
      .populate("matieres.matiereId", "nom")
      .populate("matieres.enseignantId", "nom prenom");

    if (!emploi)
      return res.status(404).json({ message: "Aucun emploi du temps trouvé" });

    res.status(200).json(emploi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Créer un nouvel emploi du temps
exports.createEmploi = async (req, res) => {
  try {
    const newEmploi = new EmploiDuTemps(req.body);
    const savedEmploi = await newEmploi.save();
    res.status(201).json(savedEmploi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Mettre à jour un emploi existant (entier)
exports.updateEmploi = async (req, res) => {
  try {
    const updatedEmploi = await EmploiDuTemps.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Retourner la nouvelle version
    )
      .populate("classeId", "nom")
      .populate("matieres.matiereId", "nom")
      .populate("matieres.enseignantId", "nom prenom");

    if (!updatedEmploi)
      return res.status(404).json({ message: "Emploi du temps non trouvé" });

    res.status(200).json(updatedEmploi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Supprimer un emploi du temps
exports.deleteEmploi = async (req, res) => {
  try {
    const deletedEmploi = await EmploiDuTemps.findByIdAndDelete(req.params.id);
    if (!deletedEmploi)
      return res.status(404).json({ message: "Emploi du temps non trouvé" });

    res.status(200).json({ message: "Emploi du temps supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ============================================
 *     GESTION DES MATIÈRES DANS L’EMPLOI
 * ============================================
 */

// ✅ Ajouter ou mettre à jour une matière dans un emploi
exports.addOrUpdateMatiere = async (req, res) => {
  try {
    const { emploiId } = req.params;
    const { matiereId, enseignantId, heureDebut, heureFin } = req.body;

    const emploi = await EmploiDuTemps.findById(emploiId);
    if (!emploi) return res.status(404).json({ message: "Emploi non trouvé" });

    // Vérifier si la matière existe déjà
    const matiereIndex = emploi.matieres.findIndex(
      (m) => m.matiereId.toString() === matiereId
    );

    if (matiereIndex > -1) {
      // Mise à jour
      emploi.matieres[matiereIndex].enseignantId =
        enseignantId || emploi.matieres[matiereIndex].enseignantId;
      emploi.matieres[matiereIndex].heureDebut =
        heureDebut || emploi.matieres[matiereIndex].heureDebut;
      emploi.matieres[matiereIndex].heureFin =
        heureFin || emploi.matieres[matiereIndex].heureFin;
    } else {
      // Ajout
      emploi.matieres.push({ matiereId, enseignantId, heureDebut, heureFin });
    }

    const updated = await emploi.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Supprimer une matière d’un emploi
exports.deleteMatiere = async (req, res) => {
  try {
    const { emploiId, matiereId } = req.params;

    const emploi = await EmploiDuTemps.findById(emploiId);
    if (!emploi) return res.status(404).json({ message: "Emploi non trouvé" });

    const newMatieres = emploi.matieres.filter(
      (m) => m.matiereId.toString() !== matiereId
    );

    if (newMatieres.length === emploi.matieres.length) {
      return res
        .status(404)
        .json({ message: "Matière non trouvée dans cet emploi" });
    }

    emploi.matieres = newMatieres;
    const updated = await emploi.save();

    res
      .status(200)
      .json({ message: "Matière supprimée avec succès", emploi: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Mettre à jour uniquement l’enseignant d’une matière
exports.updateMatiereEnseignant = async (req, res) => {
  try {
    const { emploiId, matiereId } = req.params;
    const { enseignantId } = req.body;

    if (!enseignantId) {
      return res
        .status(400)
        .json({ message: "L'enseignantId est requis pour cette opération" });
    }

    const emploi = await EmploiDuTemps.findById(emploiId);
    if (!emploi) return res.status(404).json({ message: "Emploi non trouvé" });

    const matiere = emploi.matieres.find(
      (m) => m.matiereId.toString() === matiereId
    );

    if (!matiere) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }

    matiere.enseignantId = enseignantId;
    const updated = await emploi.save();

    res
      .status(200)
      .json({ message: "Enseignant mis à jour avec succès", emploi: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Mettre à jour uniquement les horaires d’une matière
exports.updateMatiereHoraires = async (req, res) => {
  try {
    const { emploiId, matiereId } = req.params;
    const { heureDebut, heureFin } = req.body;

    if (!heureDebut && !heureFin) {
      return res.status(400).json({
        message: "Vous devez fournir au moins heureDebut ou heureFin",
      });
    }

    const emploi = await EmploiDuTemps.findById(emploiId);
    if (!emploi) return res.status(404).json({ message: "Emploi non trouvé" });

    const matiere = emploi.matieres.find(
      (m) => m.matiereId.toString() === matiereId
    );

    if (!matiere) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }

    if (heureDebut) matiere.heureDebut = heureDebut;
    if (heureFin) matiere.heureFin = heureFin;

    const updated = await emploi.save();

    res
      .status(200)
      .json({ message: "Horaires mis à jour avec succès", emploi: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
