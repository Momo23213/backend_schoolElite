const mongoose = require('mongoose');

const matiereSchema = new mongoose.Schema({
  nom: { type: String, required: true }, 
  coef: { type: Number ,default:1, required:true}
},{timestamps:true});

module.exports = mongoose.model('Matiere', matiereSchema);
