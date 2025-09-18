const Eleve = require('../models/eleve');
const Classe = require('../models/classe');
const AnneeScolaire = require('../models/anneeScolaire');
const FraisScolarite = require('../models/fraisScolarite');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Paiement = require('../models/paiementScolaire');
const genererMatricule = require('../utils/genereMatricule');
// -------------------
// Inscrire un nouvel élève
// -------------------
exports.inscrireEleve = async (req, res) => {
  try {
    const { nom, prenom, classeId, anneeScolaireId, dateNaissance,lieuNaissance, sexe, montantPaye } = req.body;
    
    // Vérifier que la classe et l'année scolaire existent
    const classe = await Classe.findById(classeId);
    const annee = await AnneeScolaire.findById(anneeScolaireId);
    if (!classe || !annee) return res.status(404).json({ message: 'Classe ou année scolaire introuvable' });

    // Vérifier les frais pour cette classe et année
    const frais = await FraisScolarite.findOne({ classeId, anneeScolaireId });
    if (!frais) return res.status(400).json({ message: 'Frais scolaires non définis pour cette classe/année' });

    // Vérifier que le montant payé couvre au moins le frais d'inscription
    if (montantPaye < frais.inscription) {
      return res.status(400).json({ message: `Le montant minimum pour l'inscription est ${frais.inscription}` });
    }


    function nettoyerNomFichier(str) {
      return str
        // Supprimer "élève/" au début
        .replace(/^élève\//, "")
        // Supprimer l'extension à la fin (ex: .pgn, .jpg, .png, etc.)
        .replace(/\.[^.]+$/, "");
    }

    // Créer l’élève
    const eleve = new Eleve({
      matricule:genererMatricule(prenom,nom,lieuNaissance),
      nom,
      prenom,
      dateNaissance,
      lieuNaissance,
      sexe,
       photo: req.file ? `${req.file.path}` : "/uploads/profile.png",
      classeId,
      fraisId:frais._id,
      parcours: [{
        classeId,
        anneeScolaireId,
        dateInscription: new Date(),
        typeInscription: 'nouveau'
      }],
      statut: 'inscrit'
    });
    await eleve.save();

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash("12345678", 10);

    //creation de compte de l'eleve
    const user = new User({
      pseudo: nom + prenom,
      email: matricule,
      password: hashedPassword,
      role: 'eleve',
      photo: req.file ? `/uploads/${req.file.filename}` : "/uploads/profile.png",
      id_eleve:eleve._id
    });
    await user.save();
    // Calcul du montant total (exclut reinscription)
    const montantTotal = frais.inscription + frais.tranche1 + frais.tranche2 + frais.tranche3;
    const montantRestant = montantTotal - montantPaye;

    // Créer le document Paiement
    const paiement = new Paiement({
      eleveId: eleve._id,
      classeId,
      anneeScolaireId,
      montantTotal,
      montantPaye,
      montantRestant,
      paiements: [
        { typePaiement: 'inscription', montant: montantPaye, datePaiement: new Date() }
      ]
    });
    await paiement.save();

    // Ajouter l’élève à la classe
    classe.eleves.push(eleve._id);
    await classe.save();

    res.status(201).json({ message: 'Élève inscrit avec paiement enregistré', eleve, frais, paiement });

  } catch (err) {
    res.status(500).json({ message: "hhhhh" + err.message });
  }
};

// -------------------
// Réinscrire un élève
// -------------------
exports.reinscrireEleve = async (req, res) => {
  try {
    const { eleveId, nouvelleClasseId, nouvelleAnneeScolaireId, typeInscription, montantPaye } = req.body;

    const eleve = await Eleve.findById(eleveId);
    if (!eleve) return res.status(404).json({ message: 'Élève introuvable' });

    const nouvelleClasse = await Classe.findById(nouvelleClasseId);
    const annee = await AnneeScolaire.findById(nouvelleAnneeScolaireId);
    if (!nouvelleClasse || !annee) return res.status(404).json({ message: 'Classe ou année scolaire introuvable' });

    // Vérifier frais
    const frais = await FraisScolarite.findOne({ classeId: nouvelleClasseId, anneeScolaireId: nouvelleAnneeScolaireId });
    if (!frais) return res.status(400).json({ message: 'Frais scolaires non définis pour cette classe/année' });

    // Vérifier que le montant payé couvre le frais de réinscription
    if (montantPaye < frais.reinscription) {
      return res.status(400).json({ message: `Le montant minimum pour la réinscription est ${frais.reinscription}` });
    }

    // Clôturer la classe précédente
    if (eleve.parcours.length > 0) {
      eleve.parcours[eleve.parcours.length - 1].dateSortie = new Date();
    }

    // Ajouter la nouvelle inscription au parcours
    eleve.parcours.push({
      classeId: nouvelleClasseId,
      anneeScolaireId: nouvelleAnneeScolaireId,
      dateInscription: new Date(),
      typeInscription: typeInscription || 'reinscrit'
    });
    eleve.classeId = nouvelleClasseId;
    eleve.statut = 'reinscrit';
    await eleve.save();

    // Calcul du montant total pour réinscription (reinscription + tranches)
    const montantTotal = frais.reinscription + frais.tranche1 + frais.tranche2 + frais.tranche3;
    const montantRestant = montantTotal - montantPaye;

    // Créer le document Paiement
    const paiement = new Paiement({
      eleveId: eleve._id,
      classeId: nouvelleClasseId,
      anneeScolaireId: nouvelleAnneeScolaireId,
      montantTotal,
      montantPaye,
      montantRestant,
      paiements: [
        { typePaiement: 'reinscription', montant: montantPaye, datePaiement: new Date() }
      ]
    });
    await paiement.save();

    // Ajouter l’élève à la nouvelle classe
    nouvelleClasse.eleves.push(eleve._id);
    await nouvelleClasse.save();

    res.status(200).json({ message: 'Élève réinscrit avec paiement enregistré', eleve, frais, paiement });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Historique complet de l'élève
// -------------------
exports.getHistoriqueEleve = async (req, res) => {
  try {
    const { eleveId } = req.params;
    const eleve = await Eleve.findById(eleveId)
      .populate('parcours.classeId', 'nom niveau')
      .populate('parcours.anneeScolaireId', 'nomDebut nomFin')
      .populate('classeId', 'nom niveau');

    if (!eleve) return res.status(404).json({ message: 'Élève introuvable' });

    // Récupérer les paiements de l'élève
    const paiements = await Paiement.find({ eleveId })
      .populate('classeId', 'nom niveau')
      .populate('anneeScolaireId', 'nomDebut nomFin');

    res.status(200).json({ eleve, paiements });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
