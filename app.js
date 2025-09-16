const express = require("express")
require("dotenv").config()
const cors = require('cors');
const db=require("./db/db")
const cookieParser = require('cookie-parser');
const https = require("https");
const http = require('http');
const { Server } = require('socket.io');

const statistiquesRoutes = require("./routes/statistiques.routes");
const logger=require("./middleware/logger")
const error=require("./middleware/errorHandler")

const app = express();
const server = http.createServer(app);
// 📂 Dossier pour stocker les images
app.use("/uploads", express.static("uploads"));
const allowedOrigins = [
  "http://localhost:3000",
  "http://http://localhost:5000",
  "https://eliteschool.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Configuration Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

db()

app.use(express.json());
app.use(cookieParser());

app.use(logger)
// Routes messages sécurisées
app.use("/api/emplois", require("./routes/emploiDuTemps.routes"));
app.use("/api/frais", require("./routes/fraiScolaire.routes"));
app.use("/api/statistiques", statistiquesRoutes);
app.use("/api/annee",require("./routes/anneeScolaire.routes"))
app.use("/api/enseignants",require("./routes/enseignant.routes"))
// app.use("/api/eleves",require("./routes/eleves.routes"))
app.use("/api/paiements",require("./routes/paiement.routes"))
app.use("/api/classe",require("./routes/classes.routes"))
app.use("/api/matieres",require("./routes/matieres.routes"))
app.use("/api/notes",require("./routes/notes.routes"))
app.use("/api/messages",require("./routes/messages.routes"))
app.use("/api/auth",require("./auth.routes"))
app.use("/api",require("./routes"))
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


// Socket.IO - Gestion des connexions
io.on('connection', (socket) => {
  console.log('Utilisateur connecté:', socket.id);

  // Rejoindre une conversation privée
  socket.on('join_private_conversation', (data) => {
    const { userId1, userId2 } = data;
    const roomName = [userId1, userId2].sort().join('_');
    socket.join(roomName);
    console.log(`Utilisateur ${socket.id} a rejoint la conversation privée: ${roomName}`);
  });

  // Rejoindre un groupe de classe
  socket.on('join_class_group', (data) => {
    const { classeId } = data;
    socket.join(`class_${classeId}`);
    console.log(`Utilisateur ${socket.id} a rejoint le groupe classe: class_${classeId}`);
  });

  // Envoyer un message privé
  socket.on('send_private_message', (data) => {
    const { expediteur, destinataire, contenu, messageId } = data;
    const roomName = [expediteur, destinataire].sort().join('_');
    
    // Émettre le message à tous les utilisateurs de la conversation
    io.to(roomName).emit('receive_message', {
      _id: messageId,
      expediteur: data.expediteurData,
      contenu,
      createdAt: new Date(),
      type: 'private'
    });
  });

  // Envoyer un message de groupe
  socket.on('send_group_message', (data) => {
    const { expediteur, classeId, contenu, messageId } = data;
    
    // Émettre le message à tous les membres du groupe
    io.to(`class_${classeId}`).emit('receive_message', {
      _id: messageId,
      expediteur: data.expediteurData,
      contenu,
      createdAt: new Date(),
      type: 'group'
    });
  });

  // Notification de frappe
  socket.on('typing', (data) => {
    const { roomName, userName } = data;
    socket.to(roomName).emit('user_typing', { userName });
  });

  socket.on('stop_typing', (data) => {
    const { roomName } = data;
    socket.to(roomName).emit('user_stop_typing');
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté:', socket.id);
  });
});

// Rendre io accessible dans les routes
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT} with Socket.IO`));
