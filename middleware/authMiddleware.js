const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Non autorisé" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contient l'id, role, etc.
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = authMiddleware;
