const router = require('express').Router();
const enseignantController = require('../controllers/enseignantController');
const upload = require('../middleware/multer.config');


// ======================== ENSEIGNANTS ========================
router.get('/', enseignantController.getAllEnseignants);
router.get('/:id', enseignantController.getEnseignantById);
router.post('/', upload.single('photo'),enseignantController.createEnseignant);
router.put('/:id', enseignantController.updateEnseignant);
router.delete('/:id', enseignantController.deleteEnseignant);


module.exports=router