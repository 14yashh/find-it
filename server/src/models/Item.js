import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['electronics', 'id_cards', 'bags', 'keys', 'books', 'clothing', 'other'],
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  dateOccurred: {
    type: Date,
    required: true
  },
  images: {
    type: [String],
    validate: [v => v.length <= 4, 'Maximum of 4 images allowed.']
  },
  verificationQuestion: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (this.type === 'found') return typeof v === 'string' && v.length >= 5;
        return true;
      },
      message: 'verificationQuestion is required (min 5 chars) for found items.'
    }
  },
  status: {
    type: String,
    enum: ['open', 'claim_pending', 'returned', 'expired'],
    default: 'open'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setDate(date.getDate() + 60);
      return date;
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      if (ret.images && ret.images.length > 0) {
        ret.images = ret.images.map(filename => `/api/files/items/${filename}`);
      }
      return ret;
    }
  }
});

itemSchema.index({ title: 'text', description: 'text' }, { weights: { title: 10, description: 5 } });
itemSchema.index({ type: 1, category: 1, status: 1, createdAt: -1 });

export default mongoose.model('Item', itemSchema);
