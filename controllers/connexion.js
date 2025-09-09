const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// -------------------
// Créer un utilisateur (inscription)
// -------------------
exports.registerUser = async (req, res) => {
  try {
    const { pseudo,email, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      pseudo,
      email,
      password: hashedPassword,
      role
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: savedUser._id,
        pseudo: savedUser.pseudo,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Login utilisateur
// -------------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier l'utilisateur
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    // Générer le JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Envoyer le cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS en prod
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    });

    res.status(200).json({
      message: "Connexion réussie",
      user: {
        id: user._id,
        pseudo: user.pseudo,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------
// Logout utilisateur
// -------------------
exports.logoutUser = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
