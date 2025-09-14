const express=require(  "express");
import {
  createAnnee,
  getAllAnnees,
  getActiveAnnee,
  setActiveAnnee,
  updateAnnee,
  deleteAnnee
} from "../controllers/anneeController.js";

const router = express.Router();

router.post("/", createAnnee);            // Créer une année
router.get("/", getAllAnnees);            // Récupérer toutes les années
router.get("/active", getActiveAnnee);   // Récupérer l'année active
router.put("/active/:id", setActiveAnnee); // Mettre une année en active
router.put("/:id", updateAnnee);         // Mettre à jour une année
router.delete("/:id", deleteAnnee);      // Supprimer une année

export default router;
