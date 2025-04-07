
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  company: String,
  phone: String,
  website: String,
  visitors: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
