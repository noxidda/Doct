import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  user: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  target: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('ActivityLog', ActivityLogSchema);
