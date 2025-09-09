const auth=require("./controllers/connexion")
const router=require("express").Router()

router.post("/ajoute",auth.registerUser)
router.post("/login",auth.loginUser)
router.get("/logout",auth.logoutUser)

module.exports=router