import express from "express";
import Resignation from "../models/Resignation.js";
import { auth } from "../middleware/auth.js";
import { role } from "../middleware/role.js";
import { isWeekend, isHoliday } from "../utils/holidayCheck.js";

const router = express.Router();

/**
 * SUBMIT resignation (EMPLOYEE)
 */
router.post("/", auth, role("EMPLOYEE"), async (req, res) => {
  const { reason, lastWorkingDay, country } = req.body;

  if (!lastWorkingDay || !country) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (
    isWeekend(lastWorkingDay) ||
    (await isHoliday(lastWorkingDay, country))
  ) {
    return res
      .status(400)
      .json({ message: "Invalid last working day" });
  }

  const resignation = await Resignation.create({
    employee: req.user.userId,
    reason,
    lastWorkingDay,
    status: "PENDING",
  });

  res.status(201).json(resignation);
});

/**
 * GET resignations
 * HR → all
 * EMPLOYEE → own
 */
router.get("/", auth, async (req, res) => {
  if (req.user.role === "HR") {
    const all = await Resignation.find().populate("employee");
    return res.json(all);
  }

  const mine = await Resignation.find({
    employee: req.user.userId,
  });

  res.json(mine);
});

/**
 * APPROVE / REJECT (HR only)
 */
router.patch("/:id", auth, role("HR"), async (req, res) => {
  const { status, exitDate } = req.body;

  const resignation = await Resignation.findById(req.params.id);
  if (!resignation) {
    return res.status(404).json({ message: "Not found" });
  }

  if (status === "APPROVED") {
    if (!exitDate) {
      return res.status(400).json({ message: "Exit date required" });
    }
    resignation.exitDate = exitDate;
  }

  resignation.status = status;
  await resignation.save();

  res.json(resignation);
});

export default router;
