# FindIt

FindIt is an internal university platform for lost and found items. It requires verifiable `.edu` emails, manual ID document verification for security, and handles automated matching between lost and found entries.

## Features
- **Strict Authentication**: Registration locked to college domains. JWT via httpOnly cookies.
- **Verification System**: Users must upload an ID document which admins review before they can post or claim items.
- **Lost & Found Items**: Post items with up to 4 images. Includes text-search indexing.
- **Claims Workflow**: Users can claim items (providing proofs or answering security questions). Admins/Owners can approve claims to reveal contact info.
- **Automated Matching**: Asynchronously matches lost and found items based on categories and text scores.
- **Notifications**: In-app notifications and email alerts (optional).
- **Admin Dashboard**: Full moderation over users, verifications, items, and claims.

## Tech Stack
- **Node.js + Express**
- **MongoDB** (Mongoose)
- **Zod** (Validation)
- **Multer + Sharp** (Image Processing)
- **Jest + Supertest** (Testing)
- **Docker** (Local MongoDB Setup)

## Setup

1. **Clone the repository.**
2. **Setup environment variables:**
   Copy `server/.env.example` to `server/.env` and update the values.
   Ensure you provide `SESSION_SECRET` and `JWT_SECRET`.
3. **Start MongoDB via Docker:**
   From the root folder, run:
   ```bash
   docker-compose up -d
   ```
4. **Install dependencies and start the server:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

## Automated Tests
Run tests with `npm test` inside the `server/` directory. Tests automatically run against a separate database (`findit_test`) safely.

## Documentation
- [API Documentation](docs/API.md)
- [Progress Tracker](docs/PROGRESS.md)
