import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  preferences: {
    notifications: {
      type: String,
      enum: ['all', 'mentions', 'none'],
      default: 'all'
    },
    theme: {
      type: String,
      default: 'dark'
    }
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
