const noteController=require("../controllers/noteController")
const router=require("express").Router()


// // ======================== NOTES ========================
router.get('/affiches', noteController.getAllNotes);
// router.get('/notes/:id', noteController.getNoteById);
router.get('/eleve/:eleveId', noteController.getNotesByEleve);
router.post('/create', noteController.ajouterNote);
//ajouter les notes en tableau
router.post("/tableau",noteController.createMultipleNotes)
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
// // CRUD Notes
router.post('/', noteController.ajouterNote);
router.get('/', noteController.getAllNotes);
router.get('/eleve/:eleveId', noteController.getNotesByEleve);
router.put('/:noteId', noteController.updateNote);
router.delete('/:noteId', noteController.deleteNote);

// // Moyenne et classement
router.get('/moyenne/trimestre/:eleveId/:trimestre', noteController.getMoyenneTrimestreEleve);
router.get('/classe/annuelle/:classeId/:anneeScolaireId', noteController.getClasseMoyenneEtRang);
router.get('/classe/trimestre/:classeId/:anneeScolaireId/:trimestre', noteController.getClasseMoyenneTrimestre);

// // Export PDF / Excel
router.get('/export/pdf/:classeId/:anneeScolaireId/:trimestre', noteController.exportNotesPDF);
router.get('/export/excel/:classeId/:anneeScolaireId/:trimestre', noteController.exportNotesExcel);

module.exports=router