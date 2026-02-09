
import express from "express";
import { auth } from "../middleware/auth.js";
import Resignation from "../models/Resignation.js";
import ExitInterview from "../models/ExitInterview.js";

const router = express.Router();

router.post("/resign", auth, async (req, res) => {
  try {
    const { lwd } = req.body;
    if (!lwd) return res.status(400).json({ message: "LWD required" });

    const resignation = await Resignation.create({
      employee: req.user.userId,
      lastWorkingDay: lwd,
    });

    res.status(200).json({ data: { resignation } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/responses", auth, async (req, res) => {
  try {
    const resignation = await Resignation.findOne({ employee: req.user.userId });
    if (!resignation) return res.status(403).json({ message: "Not allowed" });

    const interview = await ExitInterview.create({
      resignation: resignation._id,
      responses: req.body.responses,
    });

    res.status(200).json({ data: interview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
