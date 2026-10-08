# Backend Fixes Log

This document records all modifications made to `/server` to fix bugs and contract mismatches.

## Fix 1: Student Roll Number Extraction & Uniqueness Validation in Signup
- **File**: `server/src/services/authService.js`
- **Problem**: The `signup()` function destructured `{ name, email, password, department, year, phone } = fields` but omitted `rollNumber`. As a result:
  1. `rollNumber` was not passed to `User.create()`, causing Mongoose validation failure or missing roll number records for students.
  2. No pre-check was performed for existing student accounts with the same roll number prior to database insertion.
  3. Uploaded verification documents were not cleaned up when a roll number collision occurred.
- **Fix**:
  1. Destructured `rollNumber` from `fields`.
  2. Added duplicate roll number check: queries `User.findOne({ rollNumber, role: 'student' })` and throws `ApiError(409, 'An account with this roll number already exists.', 'ROLL_NUMBER_CONFLICT')`.
  3. Ensured any saved upload document on disk is unlinked before throwing `ROLL_NUMBER_CONFLICT`.
  4. Passed `rollNumber` to `User.create()`.

## Fix 2: MongoDB E11000 Error Code Mapping for Roll Number & Email
- **File**: `server/src/middleware/errorHandler.js`
- **Problem**: When MongoDB throws an `E11000` duplicate key index error, the error handler previously returned a generic `{ code: 'CONFLICT' }` error code regardless of which field conflicted.
- **Fix**: Updated `errorHandler` to check the duplicated key:
  - If `field === 'rollNumber'`, returns `{ code: 'ROLL_NUMBER_CONFLICT', message: 'A record with this rollNumber already exists.' }`.
  - If `field === 'email'`, returns `{ code: 'EMAIL_CONFLICT', message: 'A record with this email already exists.' }`.
  - Otherwise returns `{ code: 'CONFLICT' }`.

## Fix 3: Admin Users Service Return Key Payload Mismatch
- **File**: `server/src/services/adminService.js`
- **Problem**: `getUsers()` returned `{ items, page, limit, total, totalPages }`, but the frontend `useAdminUsers` hook expects `data.users`. As a result, `data.users` evaluated to `undefined`, defaulting to an empty list `[]`, causing the Verifications tab to render no students despite `pendingVerifications` in stats showing pending records.
- **Fix**: Updated `getUsers()` to return `{ users, page, limit, total, totalPages }` matching the frontend contract and hook expectations.

## Fix 4: Single Active Claim per Item Enforcement
- **Files**: `server/src/models/Claim.js`, `server/src/services/claimService.js`, `server/src/services/itemService.js`
- **Problem**: Previously multiple users could submit pending claims for the same item at the same time.
- **Fix**:
  1. Updated `Claim` index to enforce unique pending claims per item: `{ item: 1 }` with `{ unique: true, partialFilterExpression: { status: 'pending' } }`.
  2. In `claimService.createClaim()`, pre-checked if an active claim (`pending` or `approved`) already exists for the item and reject with `409 CLAIM_IN_PROGRESS`.
  3. In `itemService.getItemById()`, attached `hasActiveClaim` and `activeClaimStatus` to the item response object for client UI state rendering.

## Fix 5: Finder-Recipient Peer Handover Confirmation
- **Files**: `server/src/models/Claim.js`, `server/src/services/claimService.js`, `server/src/controllers/claimController.js`, `server/src/routes/claims.js`
- **Problem**: Previously handovers could only be confirmed via an admin endpoint. Students who found and received items had no mechanism to confirm handover themselves.
- **Fix**:
  1. Added `founderHandoverConfirmed`, `founderHandoverAt`, `receiverHandoverConfirmed`, and `receiverHandoverAt` to `Claim` schema.
  2. Implemented `PATCH /api/claims/:id/handover` endpoint allowing the person who found the item to confirm handover, and the person receiving the item to approve receipt, automatically transitioning the item status to `returned` once confirmed.

## Fix 6: Admin Claims Depositor N/A Fix (Nested Populate)
- **File**: `server/src/services/adminService.js`
- **Problem**: In `getClaims()`, `item` was populated with only `'title type status'`. The claim dossier modal on `/admin/claims` displays depositor information (`selectedClaim.item?.postedBy?.name`, `email`, `phone`), but `postedBy` was never populated or selected, causing depositor fields to display as `N/A`.
- **Fix**: Replaced shallow populate on `item` with nested populate:
  ```js
  .populate({
    path: 'item',
    select: 'title type status postedBy',
    populate: { path: 'postedBy', select: 'name email phone department' },
  })
## Fix 7: Filter Pending Verifications Count to Students Only
- **File**: `server/src/services/adminService.js`
- **Problem**: `getStats()` counted all users with `verificationStatus: 'pending'` without checking role. If an admin account defaulted to `verificationStatus: 'pending'`, it falsely incremented `pendingVerifications`.
- **Fix**: Updated `User.countDocuments({ verificationStatus: 'pending', role: 'student' })` so only actual student verification dossiers are counted.

