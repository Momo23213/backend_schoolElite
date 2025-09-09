const ExcelJS = require('exceljs');
const path = require('path');

exports.generateExcel = async (res, title, headers, rows, fileName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);

  // Logo en haut à gauche (optionnel)
  const logoPath = path.join(__dirname, '../assets/logo.png');
  if (require('fs').existsSync(logoPath)) {
    const imageId = workbook.addImage({
      filename: logoPath,
      extension: 'png',
    });
    worksheet.addImage(imageId, 'A1:B3');
  }

  // Définir les colonnes dynamiquement
  worksheet.columns = headers.map(h => ({ header: h, key: h, width: 20 }));

  // Style de l'en-tête
  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = {
      type: 'pattern',
      pattern:'solid',
      fgColor:{argb:'FFD3D3D3'}
    };
  });

  // Ajouter les données
  rows.forEach(row => worksheet.addRow(row));

  // Centrer toutes les cellules
  worksheet.eachRow(row => {
    row.eachCell(cell => {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
  });

  // Headers HTTP pour téléchargement
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${fileName}"`
  );

  await workbook.xlsx.write(res);
  res.end();
};
