const path = require("path");
const fs = require("fs");
const multer=require("multer");
const { genererMatricule } = require("../utils/Matricule");

// Créer le dossier uploads s'il n'existe pas
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}


const storages= multer.diskStorage({
    destination:function(req,file,cd){
        cd(null,"uploads")
    },
    filename:function(req,file,cd){
        // cd(null,file.originalname)
       const name = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
  const {nom, prenom, lieuNaissance } = req.body
    // ➤ Nettoyer le nom : remplacer les espaces et caractères spéciaux
    // const cleanName = name
    //   .toLowerCase()
    //   .replace(/\s+/g, '-')         // espaces → tirets
    //   .replace(/[^a-z0-9\-]/g, ''); // enlever caractères spéciaux

    cd(null, `${genererMatricule(prenom,nom,lieuNaissance)}${ext}`);

    },
    limits:{ fileSize: 5 * 1024 * 1024 } // 5 Mo max
})


module.exports=multer({storage:storages})