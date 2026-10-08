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
