const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const genererMatricule = require("../utils/genereMatricule");

// Configurer Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Stockage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const { nom, prenom, lieuNaissance } = req.body;
    const ext = file.mimetype.split("/")[1]; // récupérer l'extension à partir du type MIME
    const filename = `${genererMatricule(prenom, nom, lieuNaissance)}.${ext}`;

    return {
      folder: "eleves", // dossier Cloudinary
      public_id: filename, // nom du fichier
      allowed_formats: ["jpg", "jpeg", "png"],
    };
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
});

module.exports = upload
