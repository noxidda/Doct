import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  deadline: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Archived'],
    default: 'Active'
  }
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);
