const logger=(req,res,next)=>{
    console.log(`la date [${new Date().toISOString()}] la methode ${req.method} le chemin ${req.originalUrl}`);
    next()
}


module.exports=logger