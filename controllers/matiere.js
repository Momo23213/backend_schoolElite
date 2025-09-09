const matiere=require("../models/matiere")

exports.create=async (req,res)=>{
    const {nom,coef}=req.body
    try {
        const matieres= await matiere.create({nom,coef})
        res.status(201).json(matieres)
    } catch (error) {
        res.status(500).json(error.message)
    }
}
exports.get=async (req,res)=>{
    try {
        const matieres= await matiere.find()
        res.status(201).json(matieres)
    } catch (error) {
        res.status(500).json(error.message)
    }
}
// GET by ID
exports.getMatiereById = async (req, res) => {
  try {
    const matiere = await Matiere.findById(req.params.id);
    if (!matiere) return res.status(404).json({ message: 'Matière non trouvée' });
    res.status(200).json(matiere);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// UPDATE
exports.updateMatiere = async (req, res) => {
  try {
    const updatedMatiere = await matiere.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMatiere) return res.status(404).json({ message: 'Matière non trouvée' });
    res.status(200).json(updatedMatiere);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteMatiere = async (req, res) => {
  try {
    const deletedMatiere = await matiere.findByIdAndDelete(req.params.id);
    if (!deletedMatiere) return res.status(404).json({ message: 'Matière non trouvée' });
    res.status(200).json({ message: 'Matière supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};