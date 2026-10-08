# FindIt API Reference

## Response Envelope

Every response uses the same shape:

```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

Common error codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_APPROVED`, `NOT_FOUND`, `BAD_REQUEST`, `VALIDATION_ERROR`, `CONFLICT`, `EMAIL_CONFLICT`, `INVALID_CREDENTIALS`, `TOO_MANY_REQUESTS`, `INTERNAL_SERVER_ERROR`, `FILE_TOO_LARGE`, `INVALID_FILE_TYPE`, `FILE_REQUIRED`, `TOO_MANY_FILES`, `UPLOAD_ERROR`.

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
| `rollNumber` | string | Yes | 7 digits |
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

---

## Response Objects

### 1. User

#### 1.1 Own Profile (`GET /api/auth/me`)
Returned inside `{ success: true, data: { user: { ... } } }`.

```json
{
  "_id": "67039a518e19b33a102c9101",
  "name": "Jane Doe",
  "email": "jane.doe@college.edu",
  "department": "Computer Science",
  "rollNumber": "1234567",
  "year": "3rd Year",
  "phone": "+1-555-0199",
  "role": "student",
  "verificationStatus": "approved",
  "isSuspended": false,
  "verifiedBy": "67039a518e19b33a102c9000",
  "verifiedAt": "2026-10-06T12:00:00.000Z",
  "createdAt": "2026-10-06T10:15:30.123Z",
  "updatedAt": "2026-10-06T12:00:00.000Z"
}
```

**Field List:**
- `_id` (string, ObjectId): Unique user ID.
- `name` (string): Full name.
- `email` (string): User email address.
- `department` (string): Academic department.
- `rollNumber` (string, conditional): 7-digit roll number, present for students.
- `year` (string): Academic year.
- `phone` (string, optional): Phone number; omitted if not provided at signup.
- `role` (enum: `"student" | "admin"`): User role.
- `verificationStatus` (enum: `"pending" | "approved" | "rejected"`): Verification state.
- `isSuspended` (boolean): Whether account is suspended.
- `rejectionReason` (string, conditional): Present only if `verificationStatus` is `"rejected"`.
- `verifiedBy` (string, ObjectId, optional): Admin user ID who approved/rejected the account.
- `verifiedAt` (ISO Date string, optional): Timestamp of verification decision.
- `createdAt` (ISO Date string): Account creation timestamp.
- `updatedAt` (ISO Date string): Last account update timestamp.
- *Never included:* `passwordHash` (stripped by model toJSON & schema `select: false`), `verificationDocPath` (private disk path stripped by toJSON & schema `select: false`).

#### 1.2 Admin User List View (`GET /api/admin/users`)
Returned inside `{ success: true, data: { items: [...], page, limit, total, totalPages } }`.

```json
{
  "_id": "67039a518e19b33a102c9102",
  "name": "John Smith",
  "email": "john.smith@college.edu",
  "department": "Mechanical Engineering",
  "rollNumber": "7654321",
  "year": "2nd Year",
  "role": "student",
  "verificationStatus": "pending",
  "isSuspended": false,
  "hasDocument": true,
  "createdAt": "2026-10-06T11:20:00.000Z",
  "updatedAt": "2026-10-06T11:20:00.000Z"
}
```

**Field List:**
- Includes all standard User profile fields above.
- `hasDocument` (boolean): Computed flag indicating whether a verification document file exists on disk (`!!doc.verificationDocPath`).
- `phone` (string, optional): Present if user provided phone.
- `rejectionReason` (string, conditional): Present if status is `"rejected"`.
- `verifiedBy` / `verifiedAt` (conditional): Present if user was reviewed.
- *Never included:* `verificationDocPath` is never exposed (admin streams via `GET /api/admin/users/:id/document`).

---

### 2. Item

#### 2.1 Item List (`GET /api/items`) & Item Detail (`GET /api/items/:id`)
- `GET /api/items` returns: `{ success: true, data: { items: [...], page, limit, total, totalPages } }`.
- `GET /api/items/:id` returns: `{ success: true, data: { item: { ... } } }`.

```json
{
  "_id": "6703a11b8e19b33a102c9201",
  "type": "found",
  "title": "Black Dell Laptop Charger",
  "description": "Found near Library 2nd floor desk B4. 65W USB-C barrel connector.",
  "category": "electronics",
  "location": "Central Library 2nd Floor",
  "dateOccurred": "2026-10-06T09:30:00.000Z",
  "images": [
    "/api/files/items/4f81c9a1-5231-4a30-8041-326e0e972f2d.webp"
  ],
  "verificationQuestion": "What specific sticker is on the power brick?",
  "status": "open",
  "postedBy": {
    "_id": "67039a518e19b33a102c9101",
    "name": "Jane Doe",
    "department": "Computer Science"
  },
  "expiresAt": "2026-12-05T09:30:00.000Z",
  "createdAt": "2026-10-06T09:45:10.000Z",
  "updatedAt": "2026-10-06T09:45:10.000Z"
}
```

**Field List:**
- `_id` (string, ObjectId): Unique item ID.
- `type` (enum: `"lost" | "found"`): Item classification.
- `title` (string): Item title.
- `description` (string): Detailed description.
- `category` (enum: `"electronics" | "id_cards" | "bags" | "keys" | "books" | "clothing" | "other"`): Category.
- `location` (string): Location where item was lost or found.
- `dateOccurred` (ISO Date string): Date and time the item was lost or found.
- `images` (string array): Array of served image paths transformed to `/api/files/items/<uuid>.webp`. Max 4 images.
- `verificationQuestion` (string, conditional): **Included for non-owners** on all `"found"` items (required so claimant forms can present the question). Omitted / `undefined` on `"lost"` items.
- `status` (enum: `"open" | "claim_pending" | "returned" | "expired"`): Current item lifecycle state.
- `postedBy` (object): Populated as `{ _id, name, department }`. Owner contact (`email`, `phone`) is omitted.
- `expiresAt` (ISO Date string): Auto-computed expiration date (defaults to `createdAt + 60 days`). Always included.
- `createdAt` (ISO Date string): Creation timestamp. Always included.
- `updatedAt` (ISO Date string): Last updated timestamp. Always included.

---

### 3. Claim

#### 3.1 Claim Made (`GET /api/claims/made`)
Returned inside `{ success: true, data: { claims: [...], page, limit, total, totalPages } }`.

```json
{
  "_id": "6703b0228e19b33a102c9301",
  "item": {
    "_id": "6703a11b8e19b33a102c9201",
    "title": "Black Dell Laptop Charger",
    "type": "found",
    "images": [
      "/api/files/items/4f81c9a1-5231-4a30-8041-326e0e972f2d.webp"
    ],
    "status": "claim_pending",
    "postedBy": {
      "_id": "67039a518e19b33a102c9101",
      "name": "Jane Doe",
      "department": "Computer Science",
      "email": "jane.doe@college.edu",
      "phone": "+1-555-0199"
    }
  },
  "claimant": {
    "_id": "67039a518e19b33a102c9102",
    "name": "John Smith",
    "department": "Mechanical Engineering",
    "email": "john.smith@college.edu"
  },
  "message": "I lost this charger during my morning study session.",
  "answer": "It has an orange GitHub Octocat sticker on the side.",
  "proofImage": "/api/files/items/b149ce78-75d3-4f93-bd60-44470bc5ae22.webp",
  "status": "approved",
  "decisionNote": "Answer matched the sticker perfectly.",
  "decidedAt": "2026-10-06T14:10:00.000Z",
  "createdAt": "2026-10-06T11:00:00.000Z",
  "updatedAt": "2026-10-06T14:10:00.000Z"
}
```

#### 3.2 Claim Received (`GET /api/claims/received`)
Returned inside `{ success: true, data: { claims: [...], page, limit, total, totalPages } }`.

```json
{
  "_id": "6703b0228e19b33a102c9302",
  "item": {
    "_id": "6703a11b8e19b33a102c9201",
    "title": "Black Dell Laptop Charger",
    "type": "found",
    "images": [
      "/api/files/items/4f81c9a1-5231-4a30-8041-326e0e972f2d.webp"
    ],
    "status": "open",
    "postedBy": "67039a518e19b33a102c9101"
  },
  "claimant": {
    "_id": "67039a518e19b33a102c9102",
    "name": "John Smith",
    "department": "Mechanical Engineering"
  },
  "message": "I left this charger in the library yesterday.",
  "answer": "Blue electrical tape on the cord.",
  "status": "pending",
  "createdAt": "2026-10-06T11:30:00.000Z",
  "updatedAt": "2026-10-06T11:30:00.000Z"
}
```

#### 3.3 Admin Claim List (`GET /api/admin/claims`)
Returned inside `{ success: true, data: { claims: [...], page, limit, total, totalPages } }`.

```json
{
  "_id": "6703b0228e19b33a102c9301",
  "item": {
    "_id": "6703a11b8e19b33a102c9201",
    "title": "Black Dell Laptop Charger",
    "type": "found",
    "status": "claim_pending"
  },
  "claimant": {
    "_id": "67039a518e19b33a102c9102",
    "name": "John Smith",
    "email": "john.smith@college.edu",
    "department": "Mechanical Engineering"
  },
  "message": "I lost this charger during my morning study session.",
  "answer": "It has an orange GitHub Octocat sticker on the side.",
  "proofImage": "/api/files/items/b149ce78-75d3-4f93-bd60-44470bc5ae22.webp",
  "status": "approved",
  "decisionNote": "Answer matched the sticker perfectly.",
  "decidedAt": "2026-10-06T14:10:00.000Z",
  "createdAt": "2026-10-06T11:00:00.000Z",
  "updatedAt": "2026-10-06T14:10:00.000Z"
}
```

**Claim Field List & Summary Details:**
- `_id` (string, ObjectId): Unique claim ID.
- `item` (object): Summarised item:
  - In made/received claims: populated with `{ _id, title, type, images, status, postedBy }`. In made claims, `postedBy` is further populated with `{ _id, name, department, email?, phone? }`.
  - In admin claims: populated with `{ _id, title, type, status }`.
- `claimant` (object): Populated claimant object: `{ _id, name, department, email?, phone? }`.
- **Contact Reveal Locations & Field Names:**
  - Claimant email/phone appear under `claimant.email` and `claimant.phone`.
  - Item owner email/phone appear under `item.postedBy.email` and `item.postedBy.phone` (in made claims).
  - Both are revealed **only when `status === "approved"`**. In `pending`, `rejected`, or `cancelled` status, these fields are deleted prior to returning JSON. In admin claims, `claimant.email` is always included.
- `message` (string): Message written by claimant.
- `answer` (string, conditional): Answer to the verification question; present for `"found"` items.
- `proofImage` (string, optional): Proof image URL formatted by model toJSON as `/api/files/items/<uuid>.webp`. Field is omitted / undefined if no proof was uploaded.
- `status` (enum: `"pending" | "approved" | "rejected" | "cancelled"`): Claim status.
- `decisionNote` (string, optional): Reason / note supplied when approving or rejecting.
- `decidedAt` (ISO Date string, optional): Decision timestamp.
- `createdAt` (ISO Date string): Claim submission timestamp.
- `updatedAt` (ISO Date string): Claim update timestamp.

---

### 4. Notification

#### Notification Object (`GET /api/notifications`)
Returned inside `{ success: true, data: { notifications: [...], unreadCount, page, limit, total, totalPages } }`.

```json
{
  "_id": "6703c4018e19b33a102c9401",
  "user": "67039a518e19b33a102c9102",
  "type": "claim_approved",
  "message": "Your claim for \"Black Dell Laptop Charger\" was approved! You can now contact the founder.",
  "link": "/claims/6703b0228e19b33a102c9301",
  "isRead": false,
  "createdAt": "2026-10-06T14:10:00.100Z",
  "updatedAt": "2026-10-06T14:10:00.100Z"
}
```

**Field List:**
- `_id` (string, ObjectId): Unique notification ID.
- `user` (string, ObjectId): ID of recipient user.
- `type` (enum string): Notification trigger type:
  `user_verified`, `user_rejected`, `claim_received`, `claim_approved`, `claim_rejected`, `claim_cancelled`, `item_returned`, `item_matched`.
- `message` (string): Human-readable notification text.
- `link` (string, optional): Client-side relative route URL. Examples in code:
  - `"/profile"`
  - `"/verify"`
  - `"/items/<itemId>/claims"`
  - `"/claims/<claimId>"`
  - `"/items/<itemId>"`
  - `"/items/<itemId>/matches"`
- `isRead` (boolean): Whether notification has been read. Default `false`.
- `createdAt` (ISO Date string): Notification creation timestamp.
- `updatedAt` (ISO Date string): Notification update timestamp.

---

### 5. Match Result

#### Item Match Object (`GET /api/items/:id/matches`)
Returned inside `{ success: true, data: { matches: [...] } }`.

```json
{
  "_id": "67039e128e19b33a102c9501",
  "type": "lost",
  "title": "Lost Dell Laptop Charger 65W",
  "description": "Lost my 65W Dell charger somewhere near the library 2nd floor.",
  "category": "electronics",
  "location": "Central Library",
  "dateOccurred": "2026-10-05T18:00:00.000Z",
  "images": [],
  "status": "open",
  "postedBy": {
    "_id": "67039a518e19b33a102c9105",
    "name": "Alex Smith",
    "department": "Information Technology",
    "email": "alex.smith@college.edu"
  },
  "expiresAt": "2026-12-04T18:00:00.000Z",
  "createdAt": "2026-10-05T18:30:00.000Z",
  "updatedAt": "2026-10-05T18:30:00.000Z",
  "score": 12.5
}
```

**Field List:**
- Contains all standard `Item` fields (`_id`, `type`, `title`, `description`, `category`, `location`, `dateOccurred`, `images`, `status`, `expiresAt`, `createdAt`, `updatedAt`).
- `score` (number): Text search relevance match score computed via MongoDB `{ score: { $meta: 'textScore' } }`.
- `postedBy` (object): Populated with `{ _id, name, department, email }`.
- `verificationQuestion` (string, conditional): Present if match is of type `"found"`.
