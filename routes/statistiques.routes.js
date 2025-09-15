// routes/statistiquesRoutes.js
const express = require("express");
const router = express.Router();
const statistiquesController = require("../controllers/statistique");

// GET /api/statistiques
router.get("/", statistiquesController.getStatistiques);

module.exports = router;
