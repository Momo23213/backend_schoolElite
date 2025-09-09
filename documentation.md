# 📘 Documentation API - Gestion Scolaire

## 🔗 Base URL
http://localhost:5000/api

markdown
Copier le code

Toutes les routes doivent être appelées avec ce préfixe.  
L’authentification se fait via **JWT stocké en Cookie**.

---

## 📑 Table des matières
1. [Années scolaires](#1--années-scolaires)
2. [Élèves & Inscriptions](#2--élèves--inscriptions)
3. [Classes](#3--classes)
4. [Frais scolaires](#4--frais-scolaires)
5. [Paiements](#5--paiements)
6. [Notes & Résultats](#6--notes--résultats)
7. [Enseignants](#7--enseignants)
8. [Matières](#8--matières)
9. [Emploi du temps](#9--emploi-du-temps)
10. [Présences](#10--présences)
11. [Notifications](#11--notifications)
12. [Utilisateurs](#12--utilisateurs)
13. [Messages](#13--messages)

---

## 1️⃣ | Années scolaires

### ➤ Récupérer toutes les années
`GET /annees`

### ➤ Récupérer une année par ID
`GET /annees/:id`

### ➤ Créer une année scolaire
`POST /annees`
```json
{
  "nomDebut": 2024,
  "nomFin": 2025
}
➤ Modifier une année scolaire
PUT /annees/:id

➤ Supprimer une année scolaire
DELETE /annees/:id

2️⃣ | Élèves & Inscriptions
➤ Inscrire un élève
POST /inscrire (upload photo possible)

json
Copier le code
{
  "nom": "Diallo",
  "prenom": "Mamadou",
  "classeId": "64a7f...",
  "anneeScolaireId": "64b2f...",
  "typeInscription": "nouveau",
  "dateNaissance": "2008-05-10",
  "sexe": "M",
  "email": "eleve@test.com",
  "telephone": "622000000",
  "adresse": "Conakry",
  "montantPaye": 150000
}
➤ Réinscrire un élève
POST /reinscrire

➤ Historique scolaire d’un élève
GET /historique/:eleveId

3️⃣ | Classes
➤ Créer une classe
POST /classe/creer

json
Copier le code
{
  "nom": "6ème A",
  "niveau": "collège",
  "anneeScolaireId": "64b2f..."
}
➤ Liste des classes
GET /classe

➤ Détails d’une classe
GET /classe/:classeId

➤ Modifier une classe
PUT /classe/:classeId

➤ Supprimer une classe
DELETE /classe/:classeId

➤ Gérer élèves d’une classe
POST /classe/eleve/ajouter

POST /classe/eleve/retirer

GET /classe/:classeId/eleves

➤ Gérer enseignants d’une classe
POST /add-enseignant

POST /remove-enseignant

➤ Gérer matières d’une classe
POST /add

POST /remove

GET /:classeId

4️⃣ | Frais scolaires
➤ Créer ou modifier frais
POST /frai

json
Copier le code
{
  "classeId": "64a7f...",
  "anneeScolaireId": "64b2f...",
  "inscription": 150000,
  "reinscription": 120000,
  "tranche1": 200000,
  "tranche2": 200000,
  "tranche3": 200000
}
➤ Obtenir frais d’une classe
GET /:classeId/:anneeScolaireId

➤ Tous les frais
GET /

5️⃣ | Paiements
➤ Créer paiement initial (à l’inscription)
POST /creer

➤ Ajouter un paiement
POST /ajouter

➤ Historique paiements d’un élève
GET /eleve/:eleveId

➤ Paiements par année et classe
GET /:eleveId/:classeId/:anneeScolaireId

➤ Supprimer un paiement
DELETE /:paiementId

6️⃣ | Notes & Résultats
➤ CRUD Notes
POST /notes (ajouter note)

GET /notes (toutes les notes)

GET /notes/:id (note par ID)

GET /notes/eleve/:eleveId (notes d’un élève)

PUT /notes/:id (modifier)

DELETE /notes/:id (supprimer)

➤ Calculs
Moyenne d’un élève par trimestre :
GET /moyenne/trimestre/:eleveId/:trimestre

Classement annuel d’une classe :
GET /classe/annuelle/:classeId/:anneeScolaireId

Classement par trimestre :
GET /classe/trimestre/:classeId/:anneeScolaireId/:trimestre

➤ Export
GET /export/pdf/:classeId/:anneeScolaireId/:trimestre

GET /export/excel/:classeId/:anneeScolaireId/:trimestre

7️⃣ | Enseignants
CRUD complet :

GET /enseignants

GET /enseignants/:id

POST /enseignants

PUT /enseignants/:id

DELETE /enseignants/:id

8️⃣ | Matières
CRUD complet :

GET /matieres

GET /matieres/:id

POST /matieres

PUT /matieres/:id

DELETE /matieres/:id

9️⃣ | Emploi du temps
GET /emplois

GET /emplois/:id

GET /emplois/classe/:classeId/annee/:anneeScolaireId

POST /emplois

PUT /emplois/:id

DELETE /emplois/:id

🔟 | Présences
GET /presences

GET /presences/eleve/:eleveId

POST /presences

PUT /presences/:id

DELETE /presences/:id

1️⃣1️⃣ | Notifications
CRUD complet :

GET /notifications

GET /notifications/user/:userId

POST /notifications

PUT /notifications/:id

DELETE /notifications/:id

1️⃣2️⃣ | Utilisateurs
CRUD complet :

GET /users

GET /users/:id

POST /users

PUT /users/:id

DELETE /users/:id

1️⃣3️⃣ | Messages
GET /messages/room/:room

GET /messages/private/:user1/:user2

POST /messages

PUT /messages/:id

DELETE /messages/:id