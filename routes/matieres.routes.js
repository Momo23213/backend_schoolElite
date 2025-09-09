const matiere=require("../controllers/matiere")
const router=require("express").Router()

router.post("/create",matiere.create)
router.get("/afiches",matiere.get)
router.get("/afiches/:id",matiere.getMatiereById)
router.put("/modi/:id",matiere.updateMatiere)
router.delete("/sup/:id",matiere.deleteMatiere)

module.exports=router