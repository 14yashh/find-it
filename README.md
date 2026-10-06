# FindIt — College Lost-and-Found Portal

A Node.js / Express / MongoDB REST API for a university lost-and-found system.  
Students register with their university email, upload an ID card for verification, then post lost/found items, make claims, and get automatically matched.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 22+ |
| Docker + Docker Compose | Latest stable |
| npm | Bundled with Node |

---

## Setup

### 1. Clone and configure environment variables

```bash
# Root directory: Docker credentials
cp .env.example .env
# Edit .env — set MONGO_USER and MONGO_PASSWORD
```

```bash
# Server directory: application config
cp server/.env.example server/.env
# Edit server/.env — set MONGODB_URI (use the same MONGO_USER and MONGO_PASSWORD),
# JWT_SECRET (long random string), and optionally CLIENT_URL / email settings
```

> **Important:** The `MONGO_USER` and `MONGO_PASSWORD` in `server/.env`'s `MONGODB_URI` must match the values in the root `.env`.

### 2. Start MongoDB

```bash
# From the project root (where docker-compose.yml lives)
docker compose up -d
```

Docker will fail loudly if `MONGO_USER` or `MONGO_PASSWORD` are not set in the root `.env`.

### 3. Install dependencies

```bash
cd server
npm install
```

### 4. Seed the admin user

```bash
# Still in /server
npm run seed
```

Creates the admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env`. Idempotent — safe to run multiple times.

### 5. Start the development server

```bash
npm run dev
```

The API listens on `http://localhost:5000` by default. Test with:

```bash
curl http://localhost:5000/api/health
```

---

## Environment Variables

### Root `.env` (Docker Compose)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_USER` | ✅ | MongoDB root username |
| `MONGO_PASSWORD` | ✅ | MongoDB root password |

### `server/.env` (Application)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | ✅ | — | Full connection string: `mongodb://<user>:<pass>@127.0.0.1:27017/findit?authSource=admin` |
| `JWT_SECRET` | ✅ | — | Long random string for signing JWTs |
| `JWT_EXPIRES_IN` | No | `7d` | Token TTL (e.g. `7d`, `1h`) |
| `PORT` | No | `5000` | HTTP port |
| `CLIENT_URL` | No | `http://localhost:5173` | Frontend origin for CORS |
| `ADMIN_EMAIL` | ✅ for seed | — | Admin account email |
| `ADMIN_PASSWORD` | ✅ for seed | — | Admin account password |
| `EMAIL_ENABLED` | No | `false` | Set `true` to enable Nodemailer |
| `EMAIL_HOST` | If email | — | SMTP host |
| `EMAIL_PORT` | If email | `587` | SMTP port |
| `EMAIL_USER` | If email | — | SMTP username |
| `EMAIL_PASS` | If email | — | SMTP password |
| `EMAIL_FROM` | If email | — | Sender address |
| `DELETE_DOC_AFTER_APPROVAL` | No | `false` | Delete verification doc from disk after admin approves |

---

## Folder Structure

```
wt mpr/
├── .env.example              # Root env template (Docker credentials)
├── .gitignore
├── docker-compose.yml        # MongoDB service
├── docs/
│   ├── API.md                # Full API reference
│   └── PROGRESS.md           # Build checklist
└── server/
    ├── .env.example          # Server env template
    ├── package.json
    ├── scripts/
    │   └── seed.js           # Admin user seeder
    └── src/
        ├── app.js            # Express app factory
        ├── server.js         # Entry point
        ├── config/           # db.js, env.js, uploadDirs.js
        ├── controllers/      # Thin request/response handlers
        ├── events/           # emitter.js + listeners.js
        ├── jobs/             # expireItems.js (daily cron)
        ├── middleware/       # auth, approved, role, upload, validate, error
        ├── models/           # User, Item, Claim, Notification
        ├── routes/           # auth, admin, items, claims, notifications, files
        ├── services/         # Business logic layer
        ├── utils/            # ApiError, asyncHandler, token, sendEmail
        └── validators/       # Zod schemas
```

---

## npm Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `node --watch src/server.js` | Dev server with hot reload |
| `npm start` | `node src/server.js` | Production server |
| `npm run seed` | `node scripts/seed.js` | Create admin user |
| `npm test` | Jest + Supertest | Run automated tests (uses separate `findit_test` DB) |

---

## API Documentation

See [docs/API.md](docs/API.md) for the full endpoint reference.

---

## Security Notes

- Verification documents and item images are never served via `express.static`. They stream through authenticated endpoints only.
- All file uploads validate mimetype, extension, and magic bytes.
- Passwords are hashed with bcrypt (12 rounds).
- JWTs are stored in `httpOnly` cookies (not `localStorage`).
- MongoDB injection is blocked via `express-mongo-sanitize`.
- Input validation via Zod on all write endpoints.
