import mongoose from "mongoose";

const exitInterviewSchema = new mongoose.Schema({
  resignation: { type: mongoose.Schema.Types.ObjectId, ref: "Resignation", required: true },
  responses: [
    {
      questionText: String,
      response: String,
    },
  ],
});

export default mongoose.model("ExitInterview", exitInterviewSchema);
