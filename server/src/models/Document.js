import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Untitled Document'
  },
  content: {
    type: String,
    default: ''
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    default: null
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Document', DocumentSchema);
