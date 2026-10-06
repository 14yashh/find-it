# FindIt API Reference

## Response Envelope

Every response uses the same shape:

```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

Common error codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `BAD_REQUEST`, `VALIDATION_ERROR`, `CONFLICT`, `TOO_MANY_REQUESTS`, `INTERNAL_SERVER_ERROR`, `FILE_TOO_LARGE`, `INVALID_FILE_TYPE`.

---

## Auth & Cookies

- The JWT is stored in an **httpOnly cookie** named `token`.
- Frontend must send requests with `credentials: "include"` (fetch) or `withCredentials: true` (axios).
- CORS `origin` is controlled by the `CLIENT_URL` env var. Only that origin may send credentialed requests.
- Cookie flags: `httpOnly`, `sameSite: strict` (production) / `lax` (dev), `secure` (production only).

---

## Pagination Format

Paginated endpoints return:
```json
{
  "items": [...],
  "page": 1,
  "limit": 20,
  "total": 42,
  "totalPages": 3
}
```

---

## Enums

| Field | Values |
|-------|--------|
| item `type` | `lost`, `found` |
| item `category` | `electronics`, `id_cards`, `bags`, `keys`, `books`, `clothing`, `other` |
| item `status` | `open`, `claim_pending`, `returned`, `expired` |
| claim `status` | `pending`, `approved`, `rejected`, `cancelled` |
| user `verificationStatus` | `pending`, `approved`, `rejected` |
| user `role` | `student`, `admin` |

---

## Contact-Reveal Rules

Email and phone are **never** returned except:
- On a claim whose `status` is `"approved"`, the item owner sees the claimant's contact and the claimant sees the owner's contact.
- Admin always sees contact details in admin-only endpoints.

`postedBy` and `claimant` are otherwise projected to `{ _id, name, department }` only. `passwordHash` and `verificationDocPath` are never returned anywhere.

---

## Image URLs

Item/proof images are served at: `/api/files/items/<uuid>.webp`

The `images` array in item responses already contains full URL paths. Do not construct image URLs manually.

---

## Auth — `/api/auth`

### `POST /api/auth/signup`
**Auth:** Public  
**Content-Type:** `multipart/form-data`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `document` | file | Yes | JPG/PNG/WebP, max 5 MB — the student ID card |
| `name` | string | Yes | 2–100 chars |
| `email` | string | Yes | Must be a valid email |
| `password` | string | Yes | Min 8 chars |
| `department` | string | Yes | |
| `year` | string | Yes | |
| `phone` | string | No | |

**201:**
```json
{ "success": true, "data": { "message": "...", "user": { ... } } }
```
**Errors:** `409 EMAIL_CONFLICT`, `422 VALIDATION_ERROR`, `422 INVALID_FILE_TYPE`, `413 FILE_TOO_LARGE`

---

### `POST /api/auth/login`
**Auth:** Public  
**Content-Type:** `application/json`

```json
{ "email": "user@college.edu", "password": "password123" }
```

**200:** Sets `token` cookie. Returns `{ "message": "...", "user": { ... } }`.  
**Errors:** `401 INVALID_CREDENTIALS`, `403 FORBIDDEN` (suspended)

---

### `POST /api/auth/logout`
**Auth:** Public  
**200:** Clears the cookie.

---

### `GET /api/auth/me`
**Auth:** Logged in (any verification status)  
**200:** Returns current user object (no `passwordHash`, no `verificationDocPath`).

---

### `POST /api/auth/resubmit-document`
**Auth:** Logged in — only for users with `verificationStatus: "rejected"`  
**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|-------|------|----------|
| `document` | file | Yes |

**200:** Sets user back to `"pending"` and returns updated user.  
**Errors:** `409 CONFLICT` (not rejected status)

---

## Items — `/api/items`

All routes require: **Auth + Approved** (`verificationStatus: "approved"`).

### `GET /api/items`
**Query parameters:**

| Param | Type | Notes |
|-------|------|-------|
| `q` | string | Full-text search on title + description |
| `type` | enum | `lost` or `found` |
| `category` | enum | See enums table |
| `location` | string | Case-insensitive substring match |
| `status` | enum | Default: `open,claim_pending` |
| `dateFrom` | ISO date | Filter by `dateOccurred` |
| `dateTo` | ISO date | |
| `page` | number | Default: 1 |
| `limit` | number | Default: 12, max: 50 |
| `sort` | enum | `newest` (default) or `relevance` (requires `q`) |

**200:** Paginated list. Each item has `postedBy: { _id, name, department }`.

---

### `GET /api/items/mine`
**200:** All items posted by the current user (not paginated).

---

### `GET /api/items/:id`
**200:** Single item with `postedBy: { _id, name, department }`.

---

### `GET /api/items/:id/matches`
**Auth:** Owner only  
**200:** Up to 10 items of the opposite type, same category, open status, date within ±7 days, ranked by text relevance.
```json
{ "success": true, "data": { "matches": [...] } }
```

---

### `POST /api/items`
**Content-Type:** `multipart/form-data`  
**Rate limit:** 20 per hour per user

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `images` | file(s) | No | 0–4 files, JPG/PNG/WebP, max 5 MB each |
| `type` | enum | Yes | `lost` or `found` |
| `title` | string | Yes | |
| `description` | string | Yes | |
| `category` | enum | Yes | |
| `location` | string | Yes | |
| `dateOccurred` | ISO date | Yes | |
| `verificationQuestion` | string | Conditional | Required (min 5 chars) when `type` is `"found"` |

**201:** Created item.

---

### `PATCH /api/items/:id`
**Auth:** Owner only  
**Content-Type:** `multipart/form-data`  
Cannot edit items with status `returned` or `expired`.

| Field | Type | Notes |
|-------|------|-------|
| `images` | file(s) | New images to add (0–4 total including existing) |
| `removeImages` | string or string[] | Filenames to remove (without the URL prefix) |
| Any item field | | Partial update |

**200:** Updated item.

---

### `PATCH /api/items/:id/status`
**Auth:** Owner only  
Marks item as `"returned"`. Item must be `open` or `claim_pending`.

**200:** Updated item.

---

### `DELETE /api/items/:id`
**Auth:** Owner or Admin  
Deletes item and all its images. Cancels pending claims.

**200:** `{ "message": "Item deleted." }`

---

### `POST /api/items/:id/claims`
**Content-Type:** `multipart/form-data`  
Cannot claim own items. Item must be `"open"`.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `message` | string | Yes | Claim message |
| `answer` | string | Conditional | Required when item `type` is `"found"` (answer to the verification question) |
| `proof` | file | No | One image, JPG/PNG/WebP, max 5 MB |

**201:** Created claim.  
**Errors:** `400 BAD_REQUEST` (own item, not open, missing answer), `409 CONFLICT` (already has pending claim)

---

## Claims — `/api/claims`

All routes require: **Auth + Approved**.

### `GET /api/claims/made`
**Query:** `page`, `limit` (max 50)  
**200:** Claims the current user submitted. Contact details hidden unless claim is `"approved"`.

---

### `GET /api/claims/received`
**Query:** `page`, `limit`  
**200:** Claims made on the current user's items. Claimant contact hidden unless claim is `"approved"`.

---

### `PATCH /api/claims/:id/decision`
**Auth:** Item owner only

```json
{ "decision": "approve" | "reject", "note": "optional reason" }
```

Approving: sets claim to `approved`, item to `claim_pending`, auto-rejects all other pending claims for that item.  
**200:** Updated claim.

---

### `PATCH /api/claims/:id/cancel`
**Auth:** Claimant only  
Only works on `pending` claims.  
**200:** Cancelled claim.

---

## Notifications — `/api/notifications`

All routes require: **Auth** (no approval required).

### `GET /api/notifications`
**Query:** `page`, `limit`  
**200:**
```json
{
  "notifications": [...],
  "unreadCount": 3,
  "page": 1,
  "limit": 12,
  "total": 20,
  "totalPages": 2
}
```

### `PATCH /api/notifications/:id/read`
**200:** Marks single notification as read.

### `PATCH /api/notifications/read-all`
**200:** Marks all as read.

**Notification types:** `user_verified`, `user_rejected`, `claim_received`, `claim_approved`, `claim_rejected`, `claim_cancelled`, `item_returned`, `item_matched`

---

## Files — `/api/files`

### `GET /api/files/items/:filename`
**Auth:** Logged in (any approval status)  
Streams an item or proof image. Filename must be a UUID with `.jpg`, `.jpeg`, `.png`, or `.webp` extension.  
**Headers:** `Cache-Control: private, no-store`, `X-Content-Type-Options: nosniff`  
**404:** File not found or invalid filename.

---

## Admin — `/api/admin`

All routes require: **Auth + Admin role**.

### `GET /api/admin/users`
**Query:**

| Param | Notes |
|-------|-------|
| `verificationStatus` | Filter: `pending`, `approved`, `rejected` |
| `q` | Search name or email |
| `page` | Default: 1 |
| `limit` | Default: 20, max: 100 |
| `sort` | `oldest_pending` (default) or `newest` |

**200:** Paginated user list. Each user has `hasDocument: boolean`. `verificationDocPath` is never returned.

---

### `GET /api/admin/users/:id/document`
Streams the user's verification document.  
**Headers:** `Cache-Control: private, no-store`, `X-Content-Type-Options: nosniff`  
**404:** User or document not found.

---

### `PATCH /api/admin/users/:id/verify`
```json
{ "decision": "approve" | "reject", "reason": "required when rejecting (min 5 chars)" }
```
**200:** Updated user. Emits notification + email.  
**409:** User is not in `pending` state.

---

### `PATCH /api/admin/users/:id/suspend`
```json
{ "suspend": true | false }
```
**200:** Updated user. Cannot suspend admins or self.

---

### `GET /api/admin/stats`
**200:**
```json
{
  "stats": {
    "pendingVerifications": 5,
    "openItems": 42,
    "returnedItems": 18,
    "totalUsers": 120,
    "pendingClaims": 7
  }
}
```

---

### `GET /api/admin/items`
**Query:** `status`, `page`, `limit`  
**200:** Paginated item list. `postedBy` includes `email` for admins.

---

### `DELETE /api/admin/items/:id`
Deletes item, its images, and cancels pending claims.  
**200:** `{ "message": "Item deleted by admin" }`

---

### `GET /api/admin/claims`
**Query:** `status`, `page`, `limit`  
**200:** Paginated claim list. `claimant` includes `email` for admins.

---

### `PATCH /api/admin/claims/:id/handover`
Marks an `approved` claim's item as `"returned"`.  
**200:** Updated claim.

---

## Health — `/api/health`

### `GET /api/health`
**Auth:** Public  
**200:**
```json
{
  "status": "ok",
  "service": "FindIt API",
  "version": "1.0.0",
  "database": "connected",
  "timestamp": "2026-10-06T...",
  "uptime": "120s"
}
```
