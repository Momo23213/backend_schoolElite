const PDFDocument = require("pdfkit");
const fs = require("fs");
const fetch = require("node-fetch");
const QRCode = require("qrcode");
const mongoose = require("mongoose");
const Eleve = require('../models/eleve');

// Connexion MongoDB
async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/GestionEcole", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connecté");
  } catch (err) {
    console.error("❌ Erreur MongoDB", err);
  }
}

// Télécharger image depuis URL et retourner buffer
async function fetchImageBuffer(url) {
  try {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    console.error("❌ Erreur téléchargement image :", url, err);
    return null;
  }
}

// Créer badges multiples sur une page A4 (8 par page)
async function generateA4Badges(eleves, ecole) {
  const doc = new PDFDocument({ size: "A4", margin: 20 });
  doc.pipe(fs.createWriteStream("badges_classe.pdf"));

  const badgeWidth = 250;
  const badgeHeight = 150;
  const marginX = 20;
  const marginY = 20;
  const spacingX = 20;
  const spacingY = 20;

  const badgesPerRow = 2;
  const badgesPerCol = 4;

  let x = marginX;
  let y = marginY;
  let count = 0;

  for (const eleve of eleves) {
    // Fond du badge
    doc.rect(x, y, badgeWidth, badgeHeight).stroke();

    // Logo école
    if (ecole.logo && fs.existsSync(ecole.logo)) {
      doc.image(ecole.logo, x + 10, y + 10, { width: 30, height: 30 });
    }

    // Infos école
    doc.fontSize(10).text(ecole.nom, x + 50, y + 10);
    doc.fontSize(8).text(`Année : ${ecole.annee}`, x + 50, y + 25);
    doc.fontSize(8).text(`Contact : ${ecole.contact}`, x + 50, y + 35);

    // Photo élève
    let photoBuffer = null;
    if (eleve.photo) {
      const photoURL = `http://localhost:3002${eleve.photo}`;
      photoBuffer = await fetchImageBuffer(photoURL);
    }
    if (photoBuffer) {
      doc.image(photoBuffer, x + 10, y + 50, { width: 50, height: 50 });
    } else {
      doc.rect(x + 10, y + 50, 50, 50).stroke();
      doc.fontSize(6).text("Photo", x + 20, y + 70);
    }

    // Infos élève
    doc.fontSize(9).text(`${eleve.prenom} ${eleve.nom}`, x + 70, y + 50);
    doc.text(`Matricule : ${eleve.matricule}`, x + 70, y + 65);
    doc.text(`Sexe : ${eleve.sexe}`, x + 70, y + 80);
    doc.text(
      `Né(e) : ${new Date(eleve.dateNaissance).toLocaleDateString()} à ${eleve.lieuNaissance}`,
      x + 70,
      y + 95,
      { width: 160 }
    );
    doc.text(`Classe : ${eleve.classeId?.nom || "N/A"}`, x + 70, y + 110);

    // QR Code
    const qrData = await QRCode.toDataURL(eleve.matricule);
    const qrBuffer = Buffer.from(qrData.replace(/^data:image\/png;base64,/, ""), "base64");
    doc.image(qrBuffer, x + badgeWidth - 60 - 10, y + 50, { width: 60, height: 60 });

    // Bas du badge
    doc.fontSize(6).text(
      "Carte scolaire valable uniquement pour l’année en cours",
      x + 10,
      y + badgeHeight - 15,
      { width: badgeWidth - 20, align: "center" }
    );

    // Calcul de la position du badge suivant
    count++;
    if (count % badgesPerRow === 0) {
      x = marginX;
      y += badgeHeight + spacingY;
      if ((count / badgesPerRow) % badgesPerCol === 0) {
        doc.addPage();
        x = marginX;
        y = marginY;
      }
    } else {
      x += badgeWidth + spacingX;
    }
  }

  doc.end();
  console.log("✅ PDF multi-badges généré : badges_classe.pdf");
}

// Fonction principale
async function main() {
  await connectDB();

  const ecole = {
    nom: "École Primaire Sainte Marie",
    logo: "ecole_logo.png",
    annee: "2025 - 2026",
    contact: "+224 620 00 00 00"
  };

  const eleves = await Eleve.find().populate("classeId", "nom");

  await generateA4Badges(eleves, ecole);

  process.exit();
}

main();
