const router=require("express").Router();
const paiementController=require("../controllers/paiementController");

// ======================== PAIEMENTS ========================
router.post('/creer', paiementController.creerPaiement);
router.post('/ajouter', paiementController.ajouterPaiement);
router.get('/affiches', paiementController.getAllPaiements );
router.get('/paiement/eleves/:eleveId', paiementController.getPaiementsEleve);
router.get('/:eleveId/:classeId/:anneeScolaireId', paiementController.getPaiementParAnneeClasse);
router.delete('/:paiementId', paiementController.supprimerPaiement);


module.exports=router;