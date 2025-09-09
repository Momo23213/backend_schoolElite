const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Générer un PDF avec tableau, logo et mise en page
 * @param {*} res - réponse Express (stream)
 * @param {string} title - titre du document
 * @param {Array<string>} headers - en-têtes de colonnes
 * @param {Array<Array<string>>} rows - lignes de données
 * @param {string} fileName - nom du fichier PDF
 */
exports.generatePDF = (res, title, headers, rows, fileName) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  // Headers HTTP pour téléchargement
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  doc.pipe(res);

  // Logo
  const logoPath = path.join(__dirname, '../assets/logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 20, { width: 60 });
  }

  // Titre
  doc.fontSize(18).text(title, 150, 30, { align: 'center' });
  doc.moveDown(2);

  // Tableau
  const tableTop = 100;
  const colCount = headers.length;
  const pageWidth = 550; // largeur utile de la page
  const colWidth = pageWidth / colCount;

  let y = tableTop;

  // Ligne d’en-tête
  doc.fontSize(12).font('Helvetica-Bold');
  headers.forEach((header, i) => {
    doc.text(header, 40 + i * colWidth, y, { width: colWidth, align: 'center' });
  });

  y += 25;
  doc.font('Helvetica');

  // Lignes de données
  rows.forEach(row => {
    row.forEach((cell, i) => {
      doc.text(cell, 40 + i * colWidth, y, { width: colWidth, align: 'center' });
    });
    y += 20;

    // Saut de page automatique
    if (y > 700) {
      doc.addPage();
      y = 50;
    }
  });

  // Pied de page
  doc.moveDown(2);
  doc.fontSize(10).text(
    `Document généré le ${new Date().toLocaleDateString()}`,
    40,
    780,
    { align: 'right' }
  );

  doc.end();
};
