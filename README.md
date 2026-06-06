# Store Rating Platform - Full-Stack Web Application

A professional, role-based store rating platform built with Express.js, React.js (Vite), and MySQL. The project employs a structured layered architecture (Controller-Service-Repository), Joi schema validations, JWT authentication, and a clean modern dark-theme user interface with column sorting and filtering tables.

---

## Technical Stack
- **Frontend**: React (Vite), React Router (role-based guarding), Axios, Vanilla CSS (Premium Glassmorphism Design).
- **Backend**: Node.js, Express.js (Layered Architecture).
- **Database / ORM**: MySQL with Sequelize.
- **Validation**: Joi (backend) & inline form validators (frontend).
- **Authentication**: JWT (JSON Web Tokens) with cryptographically hashed passwords (bcrypt).

---

## Directory Structure
```text
Roxiler-Coding-Challenge/
├── backend/                  # Express server
│   ├── src/
│   │   ├── config/           # DB connection setup
│   │   ├── controllers/      # Route controllers
│   │   ├── middlewares/      # Auth, Joi validation, Error handling
│   │   ├── models/           # Sequelize database schemas
│   │   ├── repositories/     # Database CRUD abstracts
│   │   ├── routes/           # REST endpoints
│   │   ├── services/         # Business logic layer
│   │   └── utils/            # Database seed script
│   ├── .env                  # Port, JWT secret & database config
│   └── package.json
├── frontend/                 # Vite + React client
│   ├── src/
│   │   ├── components/       # Reusable Navbar, Table, Modal, Input
│   │   ├── context/          # Auth Context for user sessions
│   │   ├── pages/            # Login, Signup, Admin, User, Store Owner Dashboards
│   │   ├── services/         # Axios wrapper config
│   │   ├── App.jsx           # Routing paths & session triggers
│   │   ├── index.css         # Custom CSS Theme
│   │   └── main.jsx
│   ├── vite.config.js        # Port set to 3000
│   └── package.json
├── package.json              # Root orchestration package.json
└── README.md                 # Setup instructions
```

---

## Prerequisites
Ensure the following tools are installed on your machine:
- **Node.js** (v18 or higher recommended)
- **NPM** (v9 or higher)
- **MySQL Database Server** (Running locally on default port 3306)

---

## Quick Setup Instructions

### 1. Database Configuration
Open the backend environment file [backend/.env](file:///c:/Users/VICTUS/Desktop/Roxiler-Coding-Challenge/backend/.env) and configure your MySQL connection:
```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=store_rating_db
JWT_SECRET=super_secret_jwt_key_123456
JWT_EXPIRES_IN=7d
```
*Note: The backend automatically runs `CREATE DATABASE IF NOT EXISTS store_rating_db` during startup, so you do not need to create the schema manually.*

### 2. Install Dependencies
Open a terminal in the root directory and run the helper installer script:
```bash
npm run install-all
```
This will automatically install node modules in both the `backend/` and `frontend/` folders.

### 3. Seed Mock Data
Reset the database schema and populate it with initial data matching the character limits and validation rules:
```bash
npm run seed-db
```
This seeds the platform with:
- **1 Admin user**
- **3 Store Owners**
- **5 Normal Users**
- **3 Store Listings**
- **Mock Ratings**

### 4. Running the Servers
You will need to open two terminals to run the servers in parallel:

**Terminal 1 (Backend Server):**
```bash
npm run dev-backend
```
*Runs at http://localhost:5000*

**Terminal 2 (Frontend Client):**
```bash
npm run dev-frontend
```
*Runs at http://localhost:3000*

---

## Test Accounts (Seeded Data)
Use these seeded accounts to log in and test the different roles:

| Role | Email Address | Password | Description |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@storerating.com` | `Password123!` | Manages users & stores, monitors admin metrics. |
| **Store Owner** | `owner.alpha@storerating.com` | `Password123!` | Manages "The Super Store Alpha Express". |
| **Store Owner** | `owner.beta@storerating.com` | `Password123!` | Manages "The Mega Store Beta Express". |
| **Normal User** | `alex.jones@storerating.com` | `Password123!` | Can search stores and submit or edit star ratings. |
| **Normal User** | `jessica.t@storerating.com` | `Password123!` | Can search stores and submit or edit star ratings. |

---

## Validation & Forms Policies (Enforced)
- **Names**: 20 to 60 characters.
- **Addresses**: Maximum of 400 characters.
- **Passwords**: 8 to 16 characters. Must contain at least one uppercase letter and one special character (e.g. `!`, `@`, `#`).
- **Ratings**: Integers between 1 and 5. Enforced composite keys so that users can only submit a single rating per store, but are allowed to modify it.
