const User = require('../models/user');
const path = require('path');
const fs = require('fs');

// GET all
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createUser = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.photo = `/uploads/${req.file.filename}`;

    const newUser = new User(data);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateUser = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.photo = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (deleted.photo) {
      const imgPath = path.join(__dirname, '../', deleted.photo);
      fs.unlink(imgPath, err => {});
    }

    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
