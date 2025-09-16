const express = require("express");
const router = express.Router();
const emploiController = require("../controllers/emploiDuTempsController");

/**
 * ===============================
 * ROUTES POUR LES EMPLOIS DU TEMPS
 * ===============================
 */

// 🔹 Récupérer tous les emplois du temps
router.get("/", emploiController.getAllEmplois);

// 🔹 Récupérer un emploi du temps par son ID
router.get("/:id", emploiController.getEmploiById);

// 🔹 Récupérer tous les emplois d’une classe donnée
router.get("/classe/:classeId", emploiController.getEmploiByClasse);

// 🔹 Récupérer l’emploi d’une classe pour un jour précis
router.get(
  "/classe/:classeId/jour/:jour",
  emploiController.getEmploiByClasseAndJour
);

// 🔹 Créer un nouvel emploi du temps
router.post("/", emploiController.createEmploi);

// 🔹 Mettre à jour un emploi existant (entier)
router.put("/:id", emploiController.updateEmploi);

// 🔹 Supprimer un emploi du temps
router.delete("/:id", emploiController.deleteEmploi);

/**
 * ===============================
 * ROUTES POUR LES MATIÈRES DANS UN EMPLOI
 * ===============================
 */

// 🔹 Ajouter ou mettre à jour une matière (enseignant, horaires ou les deux)
router.post("/:emploiId/matieres", emploiController.addOrUpdateMatiere);
router.put("/:emploiId/matieres/:matiereId", emploiController.addOrUpdateMatiere);

// 🔹 Supprimer une matière
router.delete("/:emploiId/matieres/:matiereId", emploiController.deleteMatiere);

/**
 * ===============================
 * ROUTES SPÉCIFIQUES (enseignant / horaires)
 * ===============================
 */

// 🔹 Mettre à jour uniquement l’enseignant d’une matière
router.put(
  "/:emploiId/matieres/:matiereId/enseignant",
  emploiController.updateMatiereEnseignant
);

// 🔹 Mettre à jour uniquement les horaires d’une matière
router.put(
  "/:emploiId/matieres/:matiereId/horaires",
  emploiController.updateMatiereHoraires
);

module.exports = router;
