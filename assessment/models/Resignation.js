import mongoose from "mongoose";

const resignationSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lastWorkingDay: { type: Date, required: true },
  status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
});

export default mongoose.model("Resignation", resignationSchema);
