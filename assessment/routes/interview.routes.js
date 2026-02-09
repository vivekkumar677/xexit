import express from "express";
import ExitInterview from "../models/ExitInterview.js";
import Resignation from "../models/Resignation.js";
import { auth } from "../middleware/auth.js";
import { role } from "../middleware/role.js";

const router = express.Router();

/**
 * SUBMIT exit interview (EMPLOYEE)
 */
router.post("/:resignationId", auth, role("EMPLOYEE"), async (req, res) => {
  const resignation = await Resignation.findById(req.params.resignationId);

  if (!resignation || resignation.status !== "APPROVED") {
    return res.status(403).json({ message: "Not allowed" });
  }

  const exists = await ExitInterview.findOne({
    resignation: resignation._id,
  });

  if (exists) {
    return res.status(400).json({ message: "Already submitted" });
  }

  const interview = await ExitInterview.create({
    resignation: resignation._id,
    answers: req.body,
  });

  res.status(201).json(interview);
});

/**
 * VIEW interviews (HR)
 */
router.get("/", auth, role("HR"), async (req, res) => {
  const interviews = await ExitInterview.find().populate("resignation");
  res.json(interviews);
});

export default router;
