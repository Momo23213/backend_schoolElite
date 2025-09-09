



const error=(err, req, res, next)=>{
    console.error(`Erreur: ${err.message}`);
    res.status(500).json({
        Success: false,
        message:"Erreur du server"
    })
}

module.exports=error