# FindIt API Documentation

## Base URL
`/api`

## Authentication & Roles
- All endpoints except `/health` and `/auth/login`, `/auth/signup` require a valid JWT via `token` cookie.
- Item/Claim endpoints require the user's `verificationStatus` to be `approved`.
- Admin endpoints require the user's `role` to be `admin`.

---

## 1. Auth (`/auth`)
- `POST /auth/signup` - Register an account (requires university email).
- `POST /auth/login` - Authenticate and get JWT cookie.
- `POST /auth/logout` - Clear JWT cookie.
- `GET /auth/me` - Get current user profile.
- `POST /auth/verify` (multipart) - Upload a verification document (ID card) to become pending.

## 2. Items (`/items`)
- `GET /items` - List items (query: q, type, category, location, status, dateFrom, dateTo, page, limit, sort).
- `GET /items/mine` - List items posted by current user.
- `GET /items/:id` - Get item details.
- `POST /items` (multipart) - Create item (0-4 images). Rate limited.
- `PATCH /items/:id` (multipart) - Update item (owner only).
- `PATCH /items/:id/status` - Mark item as returned (owner only).
- `DELETE /items/:id` - Delete item (owner or admin).
- `GET /items/:id/matches` - Get automated matches (owner only).
- `POST /items/:id/claims` (multipart) - Make a claim on an item (optional 1 proof image).

## 3. Claims (`/claims`)
- `GET /claims/made` - Claims the current user has made.
- `GET /claims/received` - Claims made on the user's items.
- `PATCH /claims/:id/decision` - Approve/Reject a claim (item owner only).
- `PATCH /claims/:id/cancel` - Cancel a pending claim (claimant only).

## 4. Notifications (`/notifications`)
- `GET /notifications` - List current user notifications.
- `PATCH /notifications/:id/read` - Mark single notification as read.
- `PATCH /notifications/read-all` - Mark all notifications as read.

## 5. Files (`/files`)
- `GET /files/verification/:filename` - Stream verification document (admin only).
- `GET /files/items/:filename` - Stream item/claim image (authenticated).

## 6. Admin (`/admin`)
- `GET /admin/users` - List users (query: verificationStatus, q).
- `GET /admin/users/:id/document` - Stream verification document.
- `PATCH /admin/users/:id/verify` - Approve/Reject verification.
- `PATCH /admin/users/:id/suspend` - Suspend/Unsuspend user.
- `GET /admin/stats` - Platform statistics.
- `GET /admin/items` - Manage items.
- `DELETE /admin/items/:id` - Delete an item.
- `GET /admin/claims` - Manage claims.
- `PATCH /admin/claims/:id/handover` - Finalize claim and mark item returned.

## 7. Health (`/health`)
- `GET /health` - System status.
