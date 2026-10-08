# Frontend API Wiring Plan

## Objectives
Wire the static FindIt frontend (`/client`) to the live backend API (`/server` on `http://localhost:5000`), replacing all static mock data, mock hooks, and artificial state with real API calls, cookie-based session authentication, and live multi-part form submissions.

---

## Architecture & Conventions

1. **API Client & Networking**:
   - Central client wrapper at `client/src/api/client.js` with `credentials: 'include'` for JWT cookie propagation.
   - Vite proxy forwards `/api` to `http://localhost:5000`.
   - Response unwrapping: `{ success: true, data }` is unwrapped automatically to `data`.
   - Errors: Throws `ApiError` with HTTP status, machine error code (e.g. `ROLL_NUMBER_CONFLICT`, `EMAIL_CONFLICT`), and message.
   - Error mapping in `client/src/api/errors.js` maps primarily by error `code` with message text as fallback.

2. **Session & Auth Architecture**:
   - `AuthContext.jsx` bootstraps session on mount via `GET /api/auth/me`.
   - `authLoading` state prevents flash-of-redirects in route guards.
   - Route guards:
     - `PublicOnly`: Redirects authenticated users based on role/verification.
     - `RequireAuth`: Requires authenticated user.
     - `RequireApproved`: Requires `verificationStatus === 'approved'`.
     - `RequireAdmin`: Requires `role === 'admin'`.

3. **Data Fetching & Hooks Pattern**:
   - Hooks use React state and `useEffect`/`useCallback` without third-party query libraries.
   - Real API endpoints:
     - Auth: `GET /api/auth/me`, `POST /api/auth/login`, `POST /api/auth/signup`, `POST /api/auth/logout`, `POST /api/auth/resubmit-document`.
     - Items: `GET /api/items`, `GET /api/items/:id`, `GET /api/items/:id/matches`, `GET /api/items/mine`, `POST /api/items`, `PATCH /api/items/:id`, `PATCH /api/items/:id/status`, `DELETE /api/items/:id`.
     - Claims: `POST /api/items/:id/claims`, `GET /api/claims/made`, `GET /api/claims/received`, `PATCH /api/claims/:id/decision`, `PATCH /api/claims/:id/cancel`.
     - Notifications: `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all`.
     - Admin: `GET /api/admin/stats`, `GET /api/admin/users`, `GET /api/admin/users/:id/document`, `PATCH /api/admin/users/:id/verify`, `PATCH /api/admin/users/:id/suspend`, `GET /api/admin/items`, `DELETE /api/admin/items/:id`, `GET /api/admin/claims`, `PATCH /api/admin/claims/:id/handover`.

---

## Milestones & Execution Status

- [x] **M0: Audit & Foundation Setup**
  - Verify server health endpoint `GET /api/health`.
  - Fix server `signup` rollNumber handling and MongoDB duplicate key mapping (`ROLL_NUMBER_CONFLICT`).
  - Configure `apiClient` with cookie credentials and error translation.

- [x] **M1: Authentication & User Verification Lifecycle**
  - Wire `login` and `signup` forms with real endpoints.
  - Remove all pre-filled form mock state (empty initial values to prevent roll number conflicts).
  - Implement real verification document upload and resubmission on `VerificationPage`.
  - Wire `ProfilePage` to display logged-in user profile from `AuthContext` / `GET /api/auth/me`.

- [x] **M2: Items & Public Drawer**
  - Wire `BrowsePage` with live search, category, type, and pagination.
  - Wire `ItemDetailPage` with live item details and matched candidates.
  - Wire `ReportItemPage` with multi-image upload (`FormData`) for item creation and updates.
  - Wire `MyItemsPage` to fetch items from `GET /api/items/mine`.

- [x] **M3: Claims & Dispute Workflows**
  - Wire claim submission modal on `ItemDetailPage` with `proof` attachment and verification answer challenge.
  - Wire `ClaimsPage` with Made / Received tabs, decision flow (approve / reject with note), and claimant cancel action.
  - Contact details revealed only on approved claims in adherence with privacy policy.

- [x] **M4: Notifications & Admin Suite**
  - Wire `NotificationsPage` with unread counts and read-state sync.
  - Wire Admin overview metrics (`GET /api/admin/stats`).
  - Wire `AdminVerificationsPage` with decision audit, rejection reason validation, and document stream link.
  - Wire `AdminUsersPage` with search and suspension toggling.
  - Wire `AdminItemsPage` with item deletion and status updates.
  - Wire `AdminClaimsPage` with claim audit and handover confirmation.

- [x] **M5: End-to-End Smoke Verification & Cleanup**
  - Smoke test verification scripts in `.verify/`.
  - Verify complete lifecycle: student signup -> admin approval -> item intake -> dispute claim -> handover.
  - Clean up test fixtures and ensure zero remaining mock imports in production code.
