const express = require('express');
const cors = require('cors');
const db=require("./db/db")
const cookieParser = require('cookie-parser');
require('dotenv').config();
const logger=require("./middleware/logger")
const error=require("./middleware/errorHandler")

const app = express();
db()

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(logger)
// Routes messages sécurisées
app.use('/api', require("./routes"));
app.use("/auth",require("./auth.routes"))
app.use(error)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
