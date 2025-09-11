const express = require("express")
require("dotenv").config()
const cors = require('cors');
const db=require("./db/db")
const cookieParser = require('cookie-parser');



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
app.use("/api/paiements",require("./routes/paiement.routes"))
app.use("/api/classe",require("./routes/classes.routes"))
app.use("/api/matieres",require("./routes/matieres.routes"))
app.use("/api/notes",require("./routes/notes.routes"))
app.use('/api', require("./routes"));
app.use("/api/auth",require("./auth.routes"))
app.use(error)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
