import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const AttachmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Backlog', 'Todo', 'In Progress', 'Review', 'Completed'],
    default: 'Todo'
  },
  dueDate: {
    type: String,
    required: true
  },
  assigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  subtasks: [SubtaskSchema],
  comments: [CommentSchema],
  attachments: [AttachmentSchema]
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);
