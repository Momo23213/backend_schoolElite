const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  pseudo: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin','parent','enseignant'], default: 'parent' },
  photo: { type: String }, // chemin vers l'image
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
