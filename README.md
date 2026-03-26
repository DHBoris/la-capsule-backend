# La Capsule — Backend

API REST d'une application e-commerce de café artisanal. Gère l'authentification des utilisateurs, le panier, les commandes, les uploads d'images et le paiement via Stripe.

> Projet full-stack personnel — backend découplé, frontend disponible séparément.

---

## Aperçu

- Authentification JWT avec access token + refresh token
- Inscription avec vérification d'email
- Réinitialisation de mot de passe par email
- Gestion du panier (ajout, chargement, suppression)
- Paiement en ligne via Stripe Checkout
- Upload et stockage d'images via Cloudinary
- Formulaire de contact
- Middleware de vérification et renouvellement automatique des tokens

---

## Stack technique

| Catégorie | Technologies |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Base de données | MongoDB (Mongoose) |
| Authentification | JWT (jsonwebtoken) + bcrypt |
| Email | Nodemailer |
| Paiement | Stripe |
| Upload | Multer + Cloudinary |
| Config | dotenv |

---

## Prérequis

- Node.js >= 16
- npm ou yarn
- Un compte MongoDB Atlas (ou MongoDB local)
- Un compte Stripe (clés test suffisantes)
- Un compte Cloudinary
- Un compte Gmail avec mot de passe d'application

---

## Installation

```bash
# Installer les dépendances
npm install

# Créer le fichier d'environnement
cp .env.example .env
```

Renseigner les variables dans `.env` :

```env
# Frontend
FRONT_URL=http://localhost:5173

# MongoDB
MONGOLINK=mongodb+srv://<user>:<password>@cluster.mongodb.net/LaCapsule

# JWT
ACCESS_TOKEN_SECRET=votre_secret_access
REFRESH_TOKEN_SECRET=votre_secret_refresh

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Gmail
GMAIL_USER=votre_email@gmail.com
GMAIL_PASSWORD=votre_mot_de_passe_application

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
```

---

## Lancer le projet

```bash
# Développement (avec rechargement automatique)
npm run dev
# → http://localhost:5500

# Production
npm start
```

---

## Structure du projet

```
├── controllers/       # Logique métier de chaque ressource
├── middleware/        # Vérification JWT, transporter mail
├── models/            # Schémas Mongoose
├── routes/            # Définition des routes Express
├── utils/             # Envoi d'emails (vérification, reset password)
└── index.js           # Point d'entrée, config Express + MongoDB
```

---

## Routes principales

### Utilisateurs — `/users`

| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/users/signUp` | Non | Inscription |
| POST | `/users/signIn` | Non | Connexion |
| GET | `/users/signOut` | Non | Déconnexion |
| GET | `/users/verify-email` | Non | Vérification email |
| POST | `/users/loadProfil` | Oui | Charger le profil |
| PUT | `/users/updateProfile` | Oui | Modifier le profil |
| POST | `/users/requestPasswordReset` | Non | Demande reset mdp |
| POST | `/users/resetPassword` | Non | Nouveau mot de passe |

### Panier & Commande — `/`

| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/cartAdd` | Oui | Ajouter au panier |
| POST | `/cartLoad` | Oui | Charger le panier |
| POST | `/cartDelete` | Oui | Supprimer un article |
| POST | `/create-checkout-session` | Oui | Session Stripe |
| POST | `/message` | Non | Formulaire de contact |
| POST | `/uploadPhoto` | Oui | Upload image |
| GET | `/loadPhoto` | Oui | Charger les images |

---

## Sécurité

- Mots de passe hashés avec bcrypt (cost factor 10)
- Tokens JWT stockés en cookie `httpOnly`
- Renouvellement automatique du token via refresh token
- Validation du type et de la taille des fichiers uploadés (images uniquement, max 5 Mo)
- Variables sensibles gérées via `.env` (jamais committées)

---

## Frontend

Ce backend expose une API consommée par un frontend React.
Repo frontend : [la-capsule-frontend](https://github.com/DHBoris/la-capsule-frontend)

---

## Auteur

**Boris Dhaene**
[GitHub](https://github.com/DHBoris)
