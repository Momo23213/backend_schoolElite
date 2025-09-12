const express = require("express")
require("dotenv").config()
const cors = require('cors');
const db=require("./db/db")
const cookieParser = require('cookie-parser');
const https = require("https");


const logger=require("./middleware/logger")
const error=require("./middleware/errorHandler")

const app = express();
// 📂 Dossier pour stocker les images
app.use("/uploads", express.static("uploads"));
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));

db()

app.use(express.json());
app.use(cookieParser());

app.use(logger)
// Routes messages sécurisées
app.use("/api/enseignants",require("./routes/enseignant.routes"))
app.use("/api/paiements",require("./routes/paiement.routes"))
app.use("/api/classe",require("./routes/classes.routes"))
app.use("/api/matieres",require("./routes/matieres.routes"))
app.use("/api/notes",require("./routes/notes.routes"))
app.use('/api', require("./routes"));
app.use("/api/auth",require("./auth.routes"))
app.use(error)



/// keepAlive.js


const url = "https://schoolelite.onrender.com";

function pingServer() {
  https
    .get(url, (res) => {
      console.log(`[${new Date().toLocaleTimeString()}] Ping envoyé ✅ - Status: ${res.statusCode}`);
    })
    .on("error", (err) => {
      console.error("Erreur lors du ping ❌:", err.message);
    });
}

// Ping toutes les 10 minutes
setInterval(pingServer, 10 * 60 * 1000);

// Premier ping au démarrage
pingServer();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
