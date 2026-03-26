# ARCHITECTURE.md — La Capsule

---

## 1. PROJECT STRUCTURE

### Backend — `la-capsule-backend/`

```
la-capsule-backend/
├── controllers/
│   ├── cart.js               # Panier : ajout, chargement, suppression
│   ├── message.js            # Formulaire de contact
│   ├── orderConfirmation.js  # Email de confirmation de commande
│   ├── photo.js              # Upload et chargement d'images Cloudinary
│   ├── stripeController.js   # Création de session de paiement Stripe
│   ├── test.js               # Endpoint de test JWT (dev only)
│   ├── user.js               # Auth : signIn, signUp, profil, reset password
│   ├── userAddress.js        # Adresses utilisateur
│   ├── caffeine.js           # (non routé — modèle de référence)
│   ├── coffee.js             # (non routé)
│   ├── coffeeType.js         # (non routé)
│   ├── commande.js           # (non routé)
│   ├── decoration.js         # (non routé)
│   ├── milk.js               # (non routé)
│   ├── payment.js            # (non routé)
│   ├── size.js               # (non routé)
│   ├── specialCoffee.js      # (non routé)
│   └── topping.js            # (non routé)
├── middleware/
│   ├── tokenVerifier.js      # Vérification et renouvellement JWT
│   └── createMailTransporter.js  # Factory Nodemailer
├── models/
│   ├── user.js               # Schéma utilisateur (auth, adresse, tokens)
│   ├── userAddress.js        # Schéma adresse postale
│   ├── cart.js               # Schéma produit panier
│   ├── message.js            # Schéma message de contact
│   ├── photo.js              # Schéma photo Cloudinary
│   ├── unifiedCoffee.js      # Schéma café unifié (perso + normal)
│   ├── coffee.js             # Schéma café standard
│   ├── caffeine.js           # Schéma niveau de caféine
│   ├── coffeeType.js         # Schéma type de café
│   ├── commande.js           # Schéma commande
│   ├── decoration.js         # Schéma décoration
│   ├── milk.js               # Schéma lait
│   ├── payment.js            # Schéma paiement
│   ├── size.js               # Schéma taille
│   ├── specialCoffee.js      # Schéma café spécial
│   └── topping.js            # Schéma topping
├── routes/
│   ├── index.js              # Routes principales (panier, photo, Stripe, contact)
│   └── users.js              # Routes utilisateur (/users/*)
├── utils/
│   ├── sendVerificationMail.js     # Email de vérification à l'inscription
│   ├── resetPasswordMail.js        # Email de reset password
│   └── orderConfirmationMail.js    # Email de confirmation commande
├── .env                      # Variables d'environnement (non committé)
├── .gitignore
├── index.js                  # Point d'entrée Express + MongoDB
├── package.json
└── script.js                 # Script utilitaire (hors app)
```

### Frontend — `la-capsule-frontend/`

```
la-capsule-frontend/
├── src/
│   └── app/
│       ├── api/
│       │   ├── api.index.js    # Appels : panier, photo, contact, commande
│       │   ├── api.user.js     # Appels : auth, profil, reset password
│       │   └── api.stripe.js   # Appel : création session Stripe
│       ├── assets/
│       │   └── styles/         # CSS modules par composant
│       ├── components/
│       │   ├── Header.jsx       # Navigation principale
│       │   ├── Footer.jsx
│       │   ├── Cart.jsx         # Composant panier
│       │   ├── CafeNormal.jsx   # Carte café standard
│       │   ├── CafePerso.jsx    # Carte café personnalisé
│       │   ├── CheckoutForm.jsx # Formulaire paiement Stripe
│       │   ├── CheckoutSuccess.jsx
│       │   ├── Commande.jsx     # Page commande avec Stripe Elements
│       │   ├── Contact.jsx      # Formulaire de contact
│       │   ├── CreateCoffeeContent.jsx
│       │   ├── CreateCompte.jsx # Formulaire inscription
│       │   ├── History.jsx      # Historique des commandes
│       │   ├── Modal.jsx
│       │   ├── Profil.jsx       # Fiche profil utilisateur
│       │   ├── Select.jsx       # Composant select custom
│       │   ├── SignIn.jsx       # Formulaire connexion
│       │   ├── Upload.jsx       # Upload photo
│       │   ├── PopupContent.jsx # Popups (confirmation, suppression...)
│       │   └── ...              # Autres composants UI
│       ├── reducer/
│       │   ├── configureStore.jsx   # Redux store + persistance
│       │   ├── authAction.reducer.jsx  # Slice auth (user, token)
│       │   ├── coffee.reducer.jsx      # Slice café personnalisé
│       │   └── history.reducer.jsx     # Slice historique commandes
│       ├── utils/
│       │   └── functions.ts     # Utilitaires numériques (formatNumber...)
│       ├── views/
│       │   ├── Home.jsx
│       │   ├── CartPage.jsx
│       │   ├── CheckoutSuccessPage.jsx
│       │   ├── ConceptPage.jsx
│       │   ├── ContactPage.jsx
│       │   ├── CreateCoffePage.jsx
│       │   ├── CreateComptePage.jsx
│       │   ├── HistoryPage.jsx
│       │   ├── NewPassword.jsx
│       │   ├── NotFound.jsx
│       │   ├── ProfilPage.jsx
│       │   ├── SignInPage.jsx
│       │   ├── YourConceptionsPage.jsx
│       │   └── resetPassword.jsx
│       └── App.jsx              # Routeur principal + Provider Redux + Stripe
├── .env                         # Variables Vite (non committé)
├── .gitignore
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 2. HIGH-LEVEL SYSTEM DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                          UTILISATEUR                        │
│                    (Navigateur Web)                         │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP / HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│                    http://localhost:5173                      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Redux Store  │  │  React Pages │  │   Stripe.js      │  │
│  │ (Persist)    │  │  & Components│  │   (client-side)  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │ Axios (REST API)
                             │ Bearer Token + Cookies (JWT)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Express / Node.js)                │
│                    http://localhost:5500                      │
│                                                             │
│  ┌──────────────────┐   ┌──────────────────────────────┐   │
│  │  tokenVerifier   │   │         Controllers           │   │
│  │  (JWT Middleware)│──▶│  user / cart / photo /        │   │
│  └──────────────────┘   │  stripe / message / order     │   │
│                         └──────────────┬─────────────────┘  │
└────────────────────────────────────────┼────────────────────┘
                    ┌───────────────────┬┴──────────────────┐
                    ▼                   ▼                   ▼
        ┌───────────────┐   ┌─────────────────┐  ┌────────────────┐
        │   MongoDB     │   │    Cloudinary   │  │    Stripe      │
        │  (Base de     │   │  (Stockage      │  │  (Paiement)    │
        │   données)    │   │   d'images)     │  │                │
        └───────────────┘   └─────────────────┘  └────────────────┘
                                                          │
                                                          ▼
                                               ┌─────────────────┐
                                               │    Gmail        │
                                               │  (Nodemailer)   │
                                               │  Emails :       │
                                               │  - Vérif email  │
                                               │  - Reset mdp    │
                                               │  - Confirmation │
                                               └─────────────────┘
```

---

## 3. CORE COMPONENTS

### Frontend

| Attribut | Détail |
|---|---|
| **Purpose** | Interface utilisateur SPA (Single Page Application) pour naviguer, créer un café, gérer le panier et payer |
| **Framework** | React 17 |
| **State** | Redux Toolkit + Redux Persist (sessionStorage) |
| **Routing** | React Router v6 |
| **Formulaires** | Formik + Yup (validation schema) |
| **HTTP** | Axios avec headers `Authorization: Bearer <token>` |
| **Build** | Vite 3 |
| **Style** | Tailwind CSS 3 + CSS Modules |
| **Déploiement** | Build statique (`yarn build`) → Netlify / Vercel |

### Backend

| Attribut | Détail |
|---|---|
| **Purpose** | API REST exposant les ressources métier (auth, panier, photos, paiement, emails) |
| **Runtime** | Node.js |
| **Framework** | Express 4 |
| **Auth** | JWT (access token 24h + refresh token 7j en cookie httpOnly) |
| **ORM** | Mongoose 7 |
| **Upload** | Multer (mémoire) → Cloudinary stream |
| **Emails** | Nodemailer via Gmail SMTP |
| **Paiement** | Stripe SDK (sessions Checkout) |
| **Port** | 5500 |
| **Déploiement** | Node process → Railway / Render / VPS |

---

## 4. DATA STORES

### MongoDB (principale)

| Collection | Description | Champs clés |
|---|---|---|
| `users` | Comptes utilisateurs | `firstName`, `lastName`, `email`, `password` (bcrypt), `refreshToken`, `emailToken`, `isVerified`, `resetPasswordToken`, `cartList[]`, `userAddress[]` |
| `useraddresses` | Adresses postales | `detail_address`, `post_code`, `ville` |
| `carts` | Produits dans le panier | `id`, `name`, `origin`, `image`, `vegan`, `type`, `caffeine`, `size`, `price`, `quantity` |
| `messages` | Messages formulaire contact | `firstName`, `lastName`, `email`, `callNumber`, `message`, `politique` |
| `photos` | Images uploadées | `url` (Cloudinary), `public_id`, `filters` |
| `unifiedcoffees` | Cafés créés (perso + normal) | Schéma unifié des deux types |

> **Mode :** MongoDB Atlas (cloud) via `MONGOLINK` ou MongoDB local (`127.0.0.1:27017`)

### Cloudinary (stockage images)

- Stockage et CDN des photos uploadées par les utilisateurs
- Accès via `secure_url` et `public_id`

### Redux Persist (état client)

- **Storage :** sessionStorage (navigateur)
- **Contenu :** état Redux (auth token, café en cours de création, historique)
- Vidé à la fermeture de l'onglet

---

## 5. EXTERNAL INTEGRATIONS

### Stripe

| Attribut | Détail |
|---|---|
| **Purpose** | Paiement sécurisé en ligne |
| **SDK Backend** | `stripe` npm — `stripe.checkout.sessions.create()` |
| **SDK Frontend** | `@stripe/react-stripe-js` + `@stripe/stripe-js` |
| **Flux** | Frontend → Backend → Stripe API → `sessionId` → Frontend redirige vers Stripe Hosted Checkout |
| **Retour** | Stripe redirige vers `/checkout-success?session_id=...` (succès) ou `/cart` (annulation) |
| **Méthodes** | Carte bancaire + PayPal |
| **Config** | `STRIPE_SECRET_KEY` (backend), `VITE_STRIPE_PUBLIC_KEY` (frontend) |

### Cloudinary

| Attribut | Détail |
|---|---|
| **Purpose** | Hébergement et CDN des images utilisateurs |
| **Intégration** | Multer (buffer mémoire) → stream → `cloudinary.uploader.upload_stream()` |
| **Config** | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |

### Gmail / Nodemailer

| Attribut | Détail |
|---|---|
| **Purpose** | Envoi d'emails transactionnels |
| **Emails envoyés** | Vérification d'email à l'inscription, réinitialisation de mot de passe, confirmation de commande |
| **Config** | `GMAIL_USER`, `GMAIL_PASSWORD` (mot de passe d'application Google) |
| **Transport** | SMTP Gmail via `createMailTransporter()` |

---

## 6. DEPLOYMENT & INFRASTRUCTURE

### État actuel (développement local)

| Composant | URL | Commande |
|---|---|---|
| Frontend | `http://localhost:5173` | `yarn dev` |
| Backend | `http://localhost:5500` | `npm run dev` (nodemon) |
| MongoDB | `mongodb://127.0.0.1:27017` | Local ou Atlas |

### Déploiement recommandé (production)

| Composant | Service recommandé |
|---|---|
| Frontend | Vercel / Netlify (build statique) |
| Backend | Railway / Render / VPS (Node.js process) |
| Base de données | MongoDB Atlas |
| Images | Cloudinary (déjà en place) |

### CI/CD

Pas encore configuré. Recommandation : GitHub Actions avec étapes lint → build → deploy.

### Monitoring

Non configuré. Recommandation : Sentry (erreurs), Logtail ou Datadog (logs).

---

## 7. SECURITY CONSIDERATIONS

### Authentification

| Mécanisme | Détail |
|---|---|
| **Access Token** | JWT signé (`ACCESS_TOKEN_SECRET`), durée 24h, envoyé dans le header `Authorization: Bearer` |
| **Refresh Token** | JWT signé (`REFRESH_TOKEN_SECRET`), durée 7j, stocké en cookie `httpOnly: true`, `sameSite: Strict` |
| **Renouvellement** | `tokenVerifier` renouvelle automatiquement les deux tokens si l'access token est expiré |
| **Mots de passe** | bcrypt avec cost factor 10 |
| **Vérification email** | Token aléatoire (crypto 64 bytes) envoyé par email à l'inscription |
| **Reset password** | Token aléatoire (crypto 20 bytes) + expiration 1h |

### Autorisations

Routes protégées par le middleware `tokenVerifier` :
- `POST /cartAdd`, `POST /cartLoad`, `POST /cartDelete`
- `POST /uploadPhoto`, `GET /loadPhoto`
- `POST /create-checkout-session`
- `POST /users/loadProfil`, `PUT /users/updateProfile`

Routes publiques (pas d'auth requise) :
- `POST /users/signIn`, `POST /users/signUp`
- `POST /message` (formulaire contact)
- `POST /users/requestPasswordReset`, `POST /users/resetPassword`

### Autres mesures

| Mesure | Détail |
|---|---|
| **CORS** | Origines autorisées : `localhost:5173`, `localhost:4173` uniquement |
| **Upload** | Validation type MIME (jpeg/png/webp/gif) + limite 5 Mo |
| **Secrets** | Gérés via `.env`, jamais committés (`.gitignore`) |
| **Cookies** | `httpOnly: true` — inaccessibles depuis JavaScript |

---

## 8. DEVELOPMENT & TESTING

### Installation locale

```bash
# Backend
cd la-capsule-backend
npm install
cp .env.example .env   # remplir les variables
npm run dev            # port 5500

# Frontend
cd la-capsule-frontend
yarn
cp .env.example .env   # remplir VITE_STRIPE_PUBLIC_KEY
yarn dev               # port 5173
```

### Variables d'environnement requises

**Backend `.env` :**
```
FRONT_URL, MONGOLINK, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET,
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
GMAIL_USER, GMAIL_PASSWORD, STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY
```

**Frontend `.env` :**
```
VITE_STRIPE_PUBLIC_KEY
```

### Qualité du code

| Outil | Usage |
|---|---|
| **ESLint** | Linting JavaScript/JSX |
| **Prettier** | Formatage automatique (`.prettierrc` configuré) |
| **Nodemon** | Rechargement automatique du backend en dev |

### Tests

Aucun test automatisé en place actuellement (voir section 9).

---

## 9. FUTURE CONSIDERATIONS

### Dette technique

| Problème | Priorité |
|---|---|
| Aucun test unitaire ni d'intégration | Haute |
| URLs API hardcodées en `localhost:5500` dans le frontend | Haute — migrer vers `VITE_API_URL` |
| Absence de rate limiting (brute force sur `/signIn`, `/signUp`) | Haute |
| Pas de logging structuré (console.log uniquement) | Moyenne |
| Pas de versioning API (`/api/v1/`) | Moyenne |
| Controllers non routés (caffeine, milk, topping, etc.) à intégrer ou supprimer définitivement | Basse |

### Fonctionnalités prévues / roadmap

- Intégration complète du catalogue café (endpoints milk, topping, coffeeType, size)
- Historique des commandes complet (liaison base de données)
- Dashboard admin (gestion produits, commandes, messages)
- Déploiement en production (Railway + Vercel)
- Mise en place CI/CD (GitHub Actions)
- Ajout de tests (Jest + Supertest backend, React Testing Library frontend)

---

## 10. GLOSSARY

| Terme | Définition |
|---|---|
| **JWT** | JSON Web Token — format de token signé utilisé pour l'authentification |
| **Access Token** | JWT de courte durée (24h) envoyé dans chaque requête authentifiée |
| **Refresh Token** | JWT de longue durée (7j) utilisé pour renouveler l'access token sans reconnexion |
| **httpOnly** | Attribut de cookie empêchant la lecture par JavaScript (protection XSS) |
| **sameSite** | Attribut de cookie limitant l'envoi cross-site (protection CSRF) |
| **Middleware** | Fonction Express s'exécutant entre la réception d'une requête et le contrôleur |
| **tokenVerifier** | Middleware maison vérifiant et renouvelant les tokens JWT |
| **Redux Persist** | Librairie persistant l'état Redux dans sessionStorage entre les rechargements |
| **Stripe Checkout** | Page de paiement hébergée par Stripe, redirigée depuis l'application |
| **Cloudinary** | Service cloud de stockage, transformation et diffusion d'images |
| **Nodemailer** | Librairie Node.js pour l'envoi d'emails via SMTP |
| **Multer** | Middleware Express pour le traitement des fichiers uploadés (multipart/form-data) |
| **Mongoose** | ODM (Object Document Mapper) pour MongoDB en Node.js |
| **bcrypt** | Algorithme de hashage de mots de passe avec salt intégré |
| **SPA** | Single Page Application — application web dont le routing est géré côté client |
| **CORS** | Cross-Origin Resource Sharing — politique de sécurité navigateur pour les requêtes cross-domain |
| **MIME** | Type de fichier au format `type/sous-type` (ex: `image/jpeg`) |

---

## 11. PROJECT IDENTIFICATION

| Attribut | Valeur |
|---|---|
| **Nom du projet** | La Capsule |
| **Type** | Application e-commerce full-stack (café artisanal) |
| **Repo Backend** | https://github.com/DHBoris/la-capsule-backend |
| **Repo Frontend** | https://github.com/DHBoris/la-capsule-frontend |
| **Auteur** | Boris Dhaene |
| **Contact** | https://github.com/DHBoris |
| **Dernière mise à jour** | 2026-03-26 |
| **Statut** | En développement — non déployé en production |
