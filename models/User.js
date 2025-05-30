import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    company: { type: String },
    phone: { type: String },
    website: { type: String },
    email: { type: String },
    password: { type: String },
    avatarUrl: { type: String, default: '' },
  },
  { collection: "users" }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

// Done
