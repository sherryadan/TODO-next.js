import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "TaskGroup", default: null },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;

// Done 