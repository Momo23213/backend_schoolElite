// Fonction pour générer un matricule avec 3 paramètres
const genererMatricule = (param1, param2, param3)=>{
    prefix="ELIS";
   // Prendre les 3 premières lettres de chaque paramètre et mettre en majuscule
   const p1 = param1.substring(0, 3).toUpperCase();
   const p2 = param2.substring(0, 3).toUpperCase();
   const p3 = param3.substring(0, 3).toUpperCase();
 
   // Générer un nombre aléatoire à 4 chiffres
   const randomNum = Math.floor(1000 + Math.random() * 9000);
 
   // Construire le matricule
   return `${prefix}${p1}-${p2}${p3}-${randomNum}`;
 }
 
 module.exports=genererMatricule
 