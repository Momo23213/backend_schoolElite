const router = require('express').Router();

// Import des controllers
const calculeController=require("./controllers/calculeController")
const anneeController = require('./controllers/anneeScolaireController');
const eleveController = require('./controllers/eleveController');
const noteController = require('./controllers/noteController');
const enseignantController = require('./controllers/enseignantController');
const classeController = require('./controllers/classeController');
const matiereController = require('./controllers/matiereController');
const emploiController = require('./controllers/emploiDuTempsController');
const presenceController = require('./controllers/presenceController');
const paiementController = require('./controllers/paiementController');
const notificationController = require('./controllers/notificationController');
const userController = require('./controllers/userController');
const messageController = require('./controllers/messageController');
const inscrti=require("./controllers/inscriptionScolaireController")
const fraisController=require("./controllers/fraisController")
const upload = require('./middleware/multer.config');

// ======================== ANNEE SCOLAIRE ========================
router.get('/annees', anneeController.getAllAnnees);
router.get('/annees/:id', anneeController.getAnneeById);
router.post('/annees', anneeController.createAnnee);
router.put('/annees/:id', anneeController.updateAnnee);
router.delete('/annees/:id', anneeController.deleteAnnee);

// // ======================== ELEVES ========================
 router.get('/eleves', eleveController.getAllEleves);
router.get('/eleves/:id', eleveController.getEleveById);
// router.get('/eleves/classe/:classeId', eleveController.getElevesByClasse);
// router.post('/eleves',upload.single('profile'), eleveController.createEleve);
// router.put('/eleves/:id', eleveController.updateEleve);
// router.delete('/eleves/:id', eleveController.deleteEleve);

// ======================== FRAI SCOLAIRE ========================
router.post('/frai', fraisController.createOrUpdateFrais);
router.get('/:classeId/:anneeScolaireId', fraisController.getFraisByClasseAnnee);
router.get('/fraisListe', fraisController.getAllFrais);

// ======================== INSCRIPTION ========================
router.post('/inscrire', upload.single('photo'), inscrti.inscrireEleve);
router.post('/reinscrire', upload.single('photo'), inscrti.reinscrireEleve);
router.get('/historique/:eleveId', inscrti.getHistoriqueEleve);



// ======================== RESULTALT ========================
router.get('/notes/classe/:classeId/moyenne/trimestre/:trimestre', calculeController.getElevesMoyenneTrimestre);
router.get('/notes/classe/:classeId/moyenne/annee/:anneeScolaireId', calculeController.getElevesMoyenneAnnuelle);
router.get('/notes/moyenne/:eleveId/trimestre/:trimestre', calculeController.getMoyenneTrimestre);
router.get('/notes/moyenne/:eleveId/annee/:anneeScolaireId', calculeController.getMoyenneAnnuelle);
router.get('/notes/classe/:classeId/trimestre/:trimestre', calculeController.getClasseRangTrimestre);
router.get('/notes/classe/:classeId/annee/:anneeScolaireId', calculeController.getClasseRangAnnuelle);

// ======================== ENSEIGNANTS ========================
router.get('/enseignants', enseignantController.getAllEnseignants);
router.get('/enseignants/:id', enseignantController.getEnseignantById);
router.post('/enseignants', upload.single('photo'),enseignantController.createEnseignant);
router.put('/enseignants/:id', enseignantController.updateEnseignant);
router.delete('/enseignants/:id', enseignantController.deleteEnseignant);

// // ======================== CLASSES ========================
// router.post('/classe/creer', classeController.creerClasse);
// router.get('/classe', classeController.getAllClasses);
// router.get('/classes/:classeId', classeController.getClasseById);
// router.put('/classe/:classeId', classeController.updateClasse);
// router.delete('/classe/:classeId', classeController.deleteClasse);
// router.post('/classe/eleve/ajouter', classeController.ajouterEleve);
// router.post('/classe/eleve/retirer', classeController.retirerEleve);
// router.get('/classe/:classeId/eleves', classeController.getElevesClasse);
// router.get('/classe/:classeId/historique', classeController.getHistoriqueElevesClasse);
// router.post('classe/add-enseignant', classeController.addEnseignant);
// router.post('/remove-enseignant', classeController.removeEnseignant);
// router.post('classe/addMatiere', classeController.addMatiere);
// router.post('/remove', classeController.removeMatiere);
// router.get('/:classeId', classeController.getMatieres);


// // ======================== MATIERES ========================
// router.get('/momo', matiereController.getAllMatieress);
// router.get('/matieres/:id', matiereController.getMatiereById);
// router.post('/matieres/create', matiereController.createMatiere);
// router.put('/matieres/:id', matiereController.updateMatiere);
// router.delete('/matieres/:id', matiereController.deleteMatiere);

// ======================== EMPLOI DU TEMPS ========================
router.get('/emplois', emploiController.getAllEmplois);
router.get('/emplois/:id', emploiController.getEmploiById);
router.get('/emplois/classe/:classeId/annee/:anneeScolaireId', emploiController.getEmploiByClasseAnnee);
router.post('/emplois', emploiController.createEmploi);
router.put('/emplois/:id', emploiController.updateEmploi);
router.delete('/emplois/:id', emploiController.deleteEmploi);

// ======================== PRESENCES ========================
router.get('/presences', presenceController.getAllPresences);
router.get('/presences/eleve/:eleveId', presenceController.getPresencesByEleve);
router.post('/presences', presenceController.createPresence);
router.put('/presences/:id', presenceController.updatePresence);
router.delete('/presences/:id', presenceController.deletePresence);

// ======================== PAIEMENTS ========================
router.post('/creer', paiementController.creerPaiement);
router.post('/ajouter', paiementController.ajouterPaiement);
router.get('/affichesPaiements', paiementController.getAllPaiements );
router.get('/paiement/eleves/:eleveId', paiementController.getPaiementsEleve);
router.get('/:eleveId/:classeId/:anneeScolaireId', paiementController.getPaiementParAnneeClasse);
router.delete('/:paiementId', paiementController.supprimerPaiement);


// ======================== NOTIFICATIONS ========================
router.get('/notifications', notificationController.getAllNotifications);
router.get('/notifications/user/:userId', notificationController.getNotificationsByUser);
router.post('/notifications', notificationController.createNotification);
router.put('/notifications/:id', notificationController.updateNotification);
router.delete('/notifications/:id', notificationController.deleteNotification);

// ======================== USERS ========================
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// ======================== MESSAGE ========================
router.get('/messages/room/:room', messageController.getMessagesByRoom);
router.get('/messages/private/:user1/:user2', messageController.getPrivateMessages);
router.post('/messages', messageController.createMessage);
router.put('/messages/:id', messageController.updateMessage);
router.delete('/messages/:id', messageController.deleteMessage);



module.exports = router;
