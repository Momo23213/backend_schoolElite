const Classe = require('../models/classe');
const Eleve = require('../models/eleve');
const AnneeScolaire = require('../models/anneeScolaire');

// -------------------
// Créer une classe
// -------------------
exports.creerClasse = async (req, res) => {
  try {
    const { nom, niveau, anneeScolaireId,effMax } = req.body;

    const annee = await AnneeScolaire.findById(anneeScolaireId);
    if (!annee) return res.status(404).json({ message: 'Année scolaire introuvable' });

    const classe = new Classe({ nom, niveau, anneeScolaireId,effMax });
    await classe.save();

    res.status(201).json({ message: 'Classe créée avec succès', classe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Récupérer toutes les classes
// -------------------
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Classe.find()
      .populate('enseignants',"nom prenom matieres")
      .populate('anneeScolaireId',"libelle")
      .populate('eleves');

    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Récupérer une classe par ID
// -------------------
exports.getClasseById = async (req, res) => {
  try {
    const { classeId } = req.params;
    const classe = await Classe.findById(classeId)
      .populate('enseignants', 'nom prenom')
      .populate('anneeScolaireId', 'nomDebut nomFin')
      .populate('eleves', 'nom prenom photo');

    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    res.status(200).json(classe );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Mettre à jour une classe
// -------------------
exports.updateClasse = async (req, res) => {
  try {
    const { classeId } = req.params;
    const { nom, niveau, enseignants, anneeScolaireId,effMax } = req.body;

    const classe = await Classe.findById(classeId);
    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    if (nom) classe.nom = nom;
    if (effMax) classe.effMax = effMax;
    if (niveau) classe.niveau = niveau;
    if (enseignants) classe.enseignants = enseignants;
    if (anneeScolaireId) classe.anneeScolaireId = anneeScolaireId;

    await classe.save();

    res.status(200).json({ message: 'Classe mise à jour', classe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Supprimer une classe
// -------------------
exports.deleteClasse = async (req, res) => {
  try {
    const { classeId } = req.params;
    const classe = await Classe.findById(classeId);
    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    // Vérifier si la classe contient des élèves
    if (classe.eleves && classe.eleves.length > 0) {
      return res.status(400).json({ message: 'Impossible de supprimer : la classe contient des élèves.' });
    }

    await classe.deleteOne();
    res.status(200).json({ message: 'Classe supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Ajouter un élève à une classe
// -------------------
exports.ajouterEleve = async (req, res) => {
  try {
    const { classeId, eleveId } = req.body;

    const classe = await Classe.findById(classeId);
    const eleve = await Eleve.findById(eleveId);
    if (!classe || !eleve) return res.status(404).json({ message: 'Classe ou élève introuvable' });

    if (!classe.eleves.includes(eleveId)) {
      classe.eleves.push(eleveId);
      await classe.save();
    }

    res.status(200).json({ message: 'Élève ajouté à la classe', classe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Retirer un élève d'une classe et historiser
// -------------------
exports.retirerEleve = async (req, res) => {
  try {
    const { classeId, eleveId } = req.body;

    const classe = await Classe.findById(classeId);
    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    // Méthode du modèle pour retirer et historiser
    await classe.retirerEleve(eleveId);

    res.status(200).json({ message: 'Élève retiré et historisé', classe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Récupérer tous les élèves actuels d'une classe
// -------------------
exports.getElevesClasse = async (req, res) => {
  try {
    const { classeId } = req.params;
    const classe = await Classe.findById(classeId).populate('eleves', 'nom prenom photo');
    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    res.status(200).json(classe.eleves );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Récupérer l'historique des élèves d'une classe
// -------------------
exports.getHistoriqueElevesClasse = async (req, res) => {
  try {
    const { classeId } = req.params;
    const classe = await Classe.findById(classeId)
      .populate('historiqueEleves.eleveId', 'nom prenom photo')
      .populate('historiqueEleves.anneeScolaireId', 'nomDebut nomFin');

    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    res.status(200).json({ historique: classe.historiqueEleves });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// -------------------
// Ajouter un enseignant à la classe
// -------------------
exports.addEnseignant = async (req, res) => {
  try {
    const { classeId, enseignantId } = req.body;
    const classe = await Classe.findById(classeId);
    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    if (!classe.enseignants.includes(enseignantId)) {
      classe.enseignants.push(enseignantId);
      await classe.save();
    }

    res.status(200).json({ message: 'Enseignant ajouté', classe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Supprimer un enseignant d’une classe
// -------------------
exports.removeEnseignant = async (req, res) => {
  try {
    const { classeId, enseignantId } = req.body;
    const classe = await Classe.findById(classeId);
    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    classe.enseignants = classe.enseignants.filter(id => id.toString() !== enseignantId);
    await classe.save();

    res.status(200).json({ message: 'Enseignant supprimé', classe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Ajouter une matière à une classe
// -------------------
exports.addMatiere = async (req, res) => {
  try {
    const { classeId, matiereId } = req.body;
    const classe = await Classe.findById(classeId);
    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    if (!classe.matieres.includes(matiereId)) {
      classe.matieres.push(matiereId);
      await classe.save();
    }

    res.status(200).json({ message: 'Matière ajoutée à la classe', classe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Supprimer une matière d’une classe
// -------------------
exports.removeMatiere = async (req, res) => {
  try {
    const { classeId, matiereId } = req.body;
    const classe = await Classe.findById(classeId);
    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    classe.matieres = classe.matieres.filter(id => id.toString() !== matiereId);
    await classe.save();

    res.status(200).json({ message: 'Matière supprimée de la classe', classe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Récupérer toutes les matières d’une classe
// -------------------
exports.getMatieres = async (req, res) => {
  try {
    const classe = await Classe.findById(req.params.classeId)
      .populate('matieres', 'nom coefficient');

    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    res.status(200).json(classe.matieres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};