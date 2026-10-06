# FindIt – College Lost-and-Found Portal

A MERN stack backend API for managing lost and found items at a college campus.

---

## Local Setup

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for MongoDB)
- [Node.js LTS](https://nodejs.org/) (v18 or later)

### Step 1 — Clone and install dependencies

```bash
git clone <your-repo-url>
cd findit

# Install server dependencies
cd server
npm install
cd ..
```

### Step 2 — Configure environment variables

**Root directory** (Docker Compose MongoDB credentials):
```bash
# At the project root (next to docker-compose.yml)
cp .env.example .env
# Edit .env — fill in MONGO_USER and MONGO_PASSWORD
```

**Server directory** (API configuration):
```bash
cd server
cp .env.example .env
# Edit server/.env — fill in:
#   MONGODB_URI  (use the same MONGO_USER and MONGO_PASSWORD you set above)
#   JWT_SECRET   (generate a long random string)
#   ADMIN_EMAIL and ADMIN_PASSWORD (your admin account)
```

Example `server/.env` after filling in (replace with your actual values):
```
MONGODB_URI=mongodb://myuser:mypassword@127.0.0.1:27017/findit?authSource=admin
JWT_SECRET=some_very_long_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=Admin@1234
NODE_ENV=development
EMAIL_ENABLED=false
```

### Step 3 — Start MongoDB

```bash
# From the project root (where docker-compose.yml lives)
docker compose up -d
```

> **Data notes:**
> - `docker compose down` — stops the container but **keeps your data** (volume is preserved)
> - `docker compose down -v` — stops the container and **deletes all data** (volume removed)

### Step 4 — Seed the admin user

```bash
cd server
npm run seed
```

This creates the admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in your `server/.env`.
Running it a second time does nothing (idempotent).

### Step 5 — Start the API server

```bash
cd server
npm run dev    # development mode with --watch (auto-restart on changes)
# or
npm start      # production mode
```

The API will be available at `http://localhost:5000`.
Health check: `GET http://localhost:5000/api/health`

---

## Project Structure

```
findit/
├── docker-compose.yml        ← MongoDB container
├── .env.example              ← Root env template (MONGO_USER, MONGO_PASSWORD)
└── server/
    ├── .env.example          ← Server env template
    ├── scripts/
    │   └── seed.js           ← Admin seeder (npm run seed)
    ├── uploads/
    │   ├── verification/     ← Private verification documents (never served statically)
    │   └── items/            ← Item images (served via authenticated route)
    └── src/
        ├── app.js            ← Express app factory
        ├── server.js         ← Entry point
        ├── config/           ← env.js, db.js
        ├── models/           ← Mongoose models
        ├── routes/           ← Express routers
        ├── controllers/      ← Request/response handling (thin)
        ├── services/         ← Business logic
        ├── middleware/       ← auth, role, approved, validate, upload, errorHandler
        ├── validators/       ← Zod schemas
        ├── events/           ← EventEmitter + listeners
        ├── jobs/             ← node-cron jobs
        └── utils/            ← ApiError, asyncHandler, token helpers
```

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Liveness / readiness probe |
| POST | `/api/auth/signup` | Register with verification document |
| POST | `/api/auth/login` | Login (returns httpOnly cookie) |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Current user info |
| POST | `/api/auth/resubmit-document` | Re-upload doc (rejected users only) |

More endpoints added in subsequent phases (items, claims, notifications, admin).

---

## Response Format

**Success:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "..." } }
```

**Paginated list:**
```json
{ "items": [...], "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
```
