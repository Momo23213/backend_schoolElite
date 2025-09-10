const classeController = require('../controllers/classeController');
const router=require("express").Router()

// ======================== CLASSES ========================
router.post('/creer', classeController.creerClasse);
router.get('/', classeController.getAllClasses);
router.get('/:classeId', classeController.getClasseById);
router.put('/:classeId', classeController.updateClasse);
router.delete('/:classeId', classeController.deleteClasse);
router.post('/eleve/ajouter', classeController.ajouterEleve);
router.post('/eleve/retirer', classeController.retirerEleve);
router.get('/:classeId/eleves', classeController.getElevesClasse);
router.get('/:classeId/historique', classeController.getHistoriqueElevesClasse);
router.post('/add-enseignant', classeController.addEnseignant);
router.post('/remove-enseignant', classeController.removeEnseignant);
router.post('/addMatiere', classeController.addMatiere);
router.post('/remove', classeController.removeMatiere);
router.get('/:classeId', classeController.getMatieres);

module.exports = router;