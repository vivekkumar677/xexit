import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["EMPLOYEE", "HR"], default: "EMPLOYEE" },
});

export default mongoose.model("User", userSchema);
