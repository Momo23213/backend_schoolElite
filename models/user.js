const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  pseudo: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin','parent','enseignant','eleve'], default: 'eleve' },
  id_eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' },
  id_prof: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant' },
  photo: { type: String }, // chemin vers l'image
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
