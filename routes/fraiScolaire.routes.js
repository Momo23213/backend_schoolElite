const router = require('express').Router();
const fraisController=require("../controllers/fraisController")
// ======================== FRAI SCOLAIRE ========================
router.post('/frai', fraisController.createOrUpdateFrais);
router.get('/:classeId/:anneeScolaireId', fraisController.getFraisByClasseAnnee);
router.get('/fraisListe', fraisController.getAllFrais);


module.exports = router;