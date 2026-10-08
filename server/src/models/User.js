/**
 * src/models/User.js
 *
 * Mongoose schema for platform users (students and admins).
 *
 * Security notes:
 *  - passwordHash has select:false — never included in query results unless
 *    explicitly requested with .select('+passwordHash')
 *  - verificationDocPath has select:false — only the admin document-streaming
 *    route ever fetches it
 *  - toJSON transform strips __v; passwordHash and verificationDocPath are
 *    already excluded by select:false, but the transform is a belt-and-
 *    suspenders guard for any document fetched with those fields selected
 */
import mongoose from 'mongoose';
import { DEPARTMENTS } from '../constants/departments.js';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      maxlength: [100, 'Name must be 100 characters or fewer'],
    },

    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
    },

    // Never returned to clients; fetched only when verifying credentials
    passwordHash: {
      type:     String,
      required: true,
      select:   false,
    },

    department: {
      type:     String,
      required: function() { return this.role === 'student'; },
      enum:     {
        values: DEPARTMENTS,
        message: 'Invalid department',
      },
      trim:     true,
    },

    rollNumber: {
      type: String,
      trim: true,
      required: function() {
        return this.role === 'student';
      },
      match: [/^\d{7}$/, 'Roll number must be exactly 7 digits'],
    },

    year: {
      type:     String,
      required: function() { return this.role === 'student'; },
      trim:     true,
    },

    phone: {
      type: String,
      trim: true,
    },

    role: {
      type:    String,
      enum:    ['student', 'admin'],
      default: 'student',
    },

    verificationStatus: {
      type:    String,
      enum:    ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    // Absolute path on disk — PRIVATE; never returned via toJSON
    verificationDocPath: {
      type:   String,
      select: false,
    },

    rejectionReason: {
      type: String,
    },

    // Admin who approved/rejected this user
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref:  'User',
    },

    verifiedAt: {
      type: Date,
    },

    isSuspended: {
      type:    Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes ──────────────────────────────────────────────────────────────────
// email uniqueness index is created automatically by unique:true above.
// Add an index on verificationStatus for admin listing queries.
userSchema.index({ verificationStatus: 1 });

// Enforce uniqueness for rollNumber only for non-admin, non-null values
userSchema.index(
  { rollNumber: 1 },
  { unique: true, partialFilterExpression: { role: 'student', rollNumber: { $type: 'string' } } }
);

// ── toJSON transform ─────────────────────────────────────────────────────────
// Belt-and-suspenders: strips sensitive fields even if a query accidentally
// selected them. __v is noise. _id is kept as-is (frontend uses it).
userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.verificationDocPath;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);
export default User;
