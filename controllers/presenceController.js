const Presence = require('../models/presence');

// GET all
exports.getAllPresences = async (req, res) => {
  try {
    const presences = await Presence.find().populate('eleveId');
    res.status(200).json(presences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET by élève
exports.getPresencesByEleve = async (req, res) => {
  try {
    const presences = await Presence.find({ eleveId: req.params.eleveId });
    res.status(200).json(presences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createPresence = async (req, res) => {
  try {
    const newPresence = new Presence(req.body);
    const savedPresence = await newPresence.save();
    res.status(201).json(savedPresence);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updatePresence = async (req, res) => {
  try {
    const updatedPresence = await Presence.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPresence) return res.status(404).json({ message: 'Présence non trouvée' });
    res.status(200).json(updatedPresence);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deletePresence = async (req, res) => {
  try {
    const deletedPresence = await Presence.findByIdAndDelete(req.params.id);
    if (!deletedPresence) return res.status(404).json({ message: 'Présence non trouvée' });
    res.status(200).json({ message: 'Présence supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
