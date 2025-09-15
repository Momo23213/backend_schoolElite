const express=require("express");
const { createAnnee, getAllAnnees, getActiveAnnee, setActiveAnnee, updateAnnee, deleteAnnee } = require("../controllers/anneeScolaireController");


const router = express.Router();

router.post("/", createAnnee);            // Créer une année
router.get("/", getAllAnnees);            // Récupérer toutes les années
router.get("/active", getActiveAnnee);   // Récupérer l'année active
router.put("/active/:id", setActiveAnnee); // Mettre une année en active
router.put("/:id", updateAnnee);         // Mettre à jour une année
router.delete("/:id", deleteAnnee);      // Supprimer une année

module.exports= router;
