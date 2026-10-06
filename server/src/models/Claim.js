import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  claimant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    trim: true
  },
  proofImage: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  decisionNote: {
    type: String,
    trim: true
  },
  decidedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      if (ret.proofImage) {
        ret.proofImage = `/api/files/items/${ret.proofImage}`;
      }
      return ret;
    }
  }
});

// A user can have only one pending claim per item
claimSchema.index(
  { item: 1, claimant: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } }
);

export default mongoose.model('Claim', claimSchema);
