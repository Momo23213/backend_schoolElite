const mongoose = require('mongoose');
const Note = require('../models/note');
const Eleve = require('../models/eleve');
const Classe = require('../models/classe');
const AnneeScolaire = require('../models/anneeScolaire');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// -------------------
// CRUD Notes
// -------------------
exports.ajouterNote = async (req, res) => {
  try {
    const { eleveId, matiereId, enseignantId, valeur, trimestre, sequence, anneeScolaireId } = req.body;
    const note = new Note({ eleveId, matiereId, enseignantId, valeur, trimestre, sequence, anneeScolaireId });
    await note.save();
    res.status(201).json({ message: 'Note ajoutée avec succès', note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// .select('-enseignantId')
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate('matiereId','nom coef')
      .populate('enseignantId','nom prenom')
      .populate('anneeScolaireId','libelle')
      .populate({
        path:"eleveId",
        select:"-parcours",
        populate:{
          path:"classeId",
          model:"Classe",
          select:"nom"
        }
      })


    res.status(200).json( notes );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNotesByEleve = async (req, res) => {
  try {
    const { eleveId } = req.params;
    const notes = await Note.find({ eleveId })
      .populate('matiereId')
      .populate('enseignantId')
      .populate('anneeScolaireId');
    res.status(200).json( notes );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Contrôleur pour la création de plusieurs notes en une seule requête
exports.createMultipleNotes = async (req, res) => {
  try {
    const notesToInsert = req.body;

    // 1. Vérification des données
    if (!Array.isArray(notesToInsert) || notesToInsert.length === 0) {
      return res.status(400).json({ 
        message: "Les données envoyées doivent être un tableau de notes non vide." 
      });
    }

    // 2. Traitement des données et insertion
    // La méthode 'insertMany' insère tous les documents du tableau en une seule opération.
    // L'option { ordered: false } permet de continuer l'insertion même si une erreur
    // se produit sur l'un des documents.
    console.log(notesToInsert)
    const result = await Note.insertMany(notesToInsert, { ordered: false });
    // 3. Envoi de la réponse
    res.status(201).json({
      notesToInsert,
      message: `${result.length} notes ont été créées avec succès.`,
      notes: result
    });
  } catch (error) {
    // 4. Gestion des erreurs
    res.status(500).json({
      message: "Erreur lors de la création des notes. Vérifiez le format des données.",
      error: error.message
    });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { valeur, trimestre, sequence } = req.body;
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: 'Note introuvable' });

    if (valeur !== undefined) note.valeur = valeur;
    if (trimestre) note.trimestre = trimestre;
    if (sequence) note.sequence = sequence;

    await note.save();
    res.status(200).json({ message: 'Note mise à jour', note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: 'Note introuvable' });

    await note.deleteOne();
    res.status(200).json({ message: 'Note supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Moyenne et classement
// -------------------
exports.getMoyenneTrimestreEleve = async (req, res) => {
  try {
    const { eleveId, trimestre } = req.params;
    const result = await Note.aggregate([
      { $match: { eleveId: new mongoose.Types.ObjectId(eleveId), trimestre } },
      { $group: { _id: '$eleveId', moyenneTrimestre: { $avg: '$valeur' } } }
    ]);
    res.status(200).json({ moyenneTrimestre: result[0]?.moyenneTrimestre || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClasseMoyenneEtRang = async (req, res) => {
  try {
    const { classeId, anneeScolaireId } = req.params;
    const classe = await Classe.findById(classeId);
    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    const eleveIds = classe.eleves.map(id => new mongoose.Types.ObjectId(id));
    const aggregation = await Note.aggregate([
      { $match: { eleveId: { $in: eleveIds }, anneeScolaireId: new mongoose.Types.ObjectId(anneeScolaireId) } },
      { $group: { _id: '$eleveId', moyenneAnnuelle: { $avg: '$valeur' } } },
      { $sort: { moyenneAnnuelle: -1 } }
    ]);

    let rang = 1, prevMoyenne = null;
    aggregation.forEach((el, index) => {
      if (prevMoyenne !== null && el.moyenneAnnuelle < prevMoyenne) rang = index + 1;
      el.rang = rang;
      prevMoyenne = el.moyenneAnnuelle;
    });

    const result = await Eleve.populate(aggregation, { path: '_id', select: 'nom prenom' });
    res.status(200).json({ classement: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClasseMoyenneTrimestre = async (req, res) => {
  try {
    const { classeId, anneeScolaireId, trimestre } = req.params;
    const classe = await Classe.findById(classeId);
    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    const eleveIds = classe.eleves.map(id => new mongoose.Types.ObjectId(id));
    const aggregation = await Note.aggregate([
      { $match: { eleveId: { $in: eleveIds }, anneeScolaireId: new mongoose.Types.ObjectId(anneeScolaireId), trimestre } },
      { $group: { _id: '$eleveId', moyenneTrimestre: { $avg: '$valeur' } } },
      { $sort: { moyenneTrimestre: -1 } }
    ]);

    let rang = 1, prevMoyenne = null;
    aggregation.forEach((el, index) => {
      if (prevMoyenne !== null && el.moyenneTrimestre < prevMoyenne) rang = index + 1;
      el.rang = rang;
      prevMoyenne = el.moyenneTrimestre;
    });

    const result = await Eleve.populate(aggregation, { path: '_id', select: 'nom prenom' });
    res.status(200).json({ classement: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Export PDF
// -------------------
exports.exportNotesPDF = async (req, res) => {
  try {
    const { classeId, anneeScolaireId, trimestre } = req.params;
    const classe = await Classe.findById(classeId).populate('eleves', 'nom prenom');
    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    const eleveIds = classe.eleves.map(e => e._id);
    const notes = await Note.find({ eleveId: { $in: eleveIds }, anneeScolaireId, trimestre })
      .populate('eleveId', 'nom prenom')
      .populate('matiereId', 'nom');

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const fileName = `Notes_${classe.nom}_${trimestre}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    doc.pipe(res);

    const logoPath = path.join(__dirname, '../assets/logo.png');
    if (fs.existsSync(logoPath)) doc.image(logoPath, 40, 20, { width: 60 });

    doc.fontSize(18).text(`Notes - ${classe.nom} - ${trimestre}`, { align: 'center' });
    doc.moveDown(2);

    const headers = ['Élève', 'Matière', 'Note'];
    const tableTop = 120;
    const colWidth = 200;
    let y = tableTop;

    doc.fontSize(12).font('Helvetica-Bold');
    headers.forEach((h, i) => doc.text(h, 40 + i * colWidth, y, { width: colWidth, align: 'center' }));
    y += 25;
    doc.font('Helvetica');

    notes.forEach(n => {
      doc.text(`${n.eleveId.nom} ${n.eleveId.prenom}`, 40, y, { width: colWidth, align: 'center' });
      doc.text(n.matiereId.nom, 240, y, { width: colWidth, align: 'center' });
      doc.text(n.valeur.toString(), 440, y, { width: colWidth, align: 'center' });
      y += 20;
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Export Excel
// -------------------
exports.exportNotesExcel = async (req, res) => {
  try {
    const { classeId, anneeScolaireId, trimestre } = req.params;
    const classe = await Classe.findById(classeId).populate('eleves', 'nom prenom');
    if (!classe) return res.status(404).json({ message: 'Classe introuvable' });

    const eleveIds = classe.eleves.map(e => e._id);
    const notes = await Note.find({ eleveId: { $in: eleveIds }, anneeScolaireId, trimestre })
      .populate('eleveId', 'nom prenom')
      .populate('matiereId', 'nom');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Notes ${trimestre}`);
    worksheet.columns = [
      { header: 'Élève', key: 'eleve', width: 30 },
      { header: 'Matière', key: 'matiere', width: 30 },
      { header: 'Note', key: 'note', width: 15 }
    ];

    notes.forEach(n => {
      worksheet.addRow({ eleve: `${n.eleveId.nom} ${n.eleveId.prenom}`, matiere: n.matiereId.nom, note: n.valeur });
    });

    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });

    const fileName = `Notes_${classe.nom}_${trimestre}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
