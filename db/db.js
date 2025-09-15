const mongoose=require("mongoose")
// require("dotenv").config({path:"./config/.env"});

const db=async ()=>{
    try{
          await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
          console.log("Mongodb connecté");
    }catch(err){
        console.log("Mongodb non connecté");
        console.log(`error ${err}`);
    }
}

module.exports=db
// // -------------------------
// // Connexion MongoDB
// // -------------------------
// mongoose.connect(, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connecté'))
//   .catch(err => console.log(err));
