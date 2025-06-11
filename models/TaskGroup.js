import mongoose from "mongoose";


const TaskGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  taskIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shareToken: { type: String, default: null },
  linkAccess: { type: String, enum: ["off", "read", "edit"], default: "off" },
  createdAt: { type: Date, default: Date.now },
  groupid: { type: String, unique: true },
});

export default mongoose.models.TaskGroup ||
  mongoose.model("TaskGroup", TaskGroupSchema);