// import express from "express";
// import Resignation from "../models/Resignation.js";
// import ExitInterview from "../models/ExitInterview.js";
// import { auth } from "../middleware/auth.js";

// const router = express.Router();

// /**
//  * VIEW ALL RESIGNATIONS (HR)
//  */
// // routes/admin.routes.js
// router.get("/resignations", auth, async (req, res) => {
//   if (req.user.role !== "HR") {
//     return res.status(403).json({ message: "Not allowed" });
//   }

//   const allResignations = await Resignation.find();
  
//   res.status(200).json({
//     data: allResignations, // ✅ Must be an array in 'data'
//   });
// });


// /**
//  * APPROVE / REJECT RESIGNATION
//  */
// router.put("/conclude_resignation", auth, async (req, res) => {
//   const { resignationId, approved, lwd } = req.body;

//   if (!resignationId) {
//     return res.status(400).json({ message: "Missing resignationId" });
//   }

//   const resignation = await Resignation.findById(resignationId);
//   if (!resignation) {
//     return res.status(404).json({ message: "Not found" });
//   }

//   resignation.status = approved ? "APPROVED" : "REJECTED";
//   resignation.exitDate = lwd;

//   await resignation.save();

//   res.status(200).json({
//     data: resignation,
//   });
// });

// // routes/admin.routes.js
// router.get("/exit_responses", auth, async (req, res) => {
//   if (req.user.role !== "HR") {
//     return res.status(403).json({ message: "Not allowed" });
//   }

//   const responses = await ExitInterview.find();
//   res.status(200).json({
//     data: responses, // ✅ must be wrapped in data
//   });
// });


// export default router;

import express from "express";
import { auth } from "../middleware/auth.js";
import Resignation from "../models/Resignation.js";
import ExitInterview from "../models/ExitInterview.js";

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user.role !== "HR") return res.status(403).json({ message: "Not allowed" });
  next();
};

router.get("/resignations", auth, isAdmin, async (req, res) => {
  const allResignations = await Resignation.find();
  res.status(200).json({ data: allResignations });
});

router.put("/conclude_resignation", auth, isAdmin, async (req, res) => {
  const { resignationId, approved, lwd } = req.body;
  if (!resignationId) return res.status(400).json({ message: "Missing resignationId" });

  const resignation = await Resignation.findById(resignationId);
  if (!resignation) return res.status(404).json({ message: "Not found" });

  resignation.status = approved ? "APPROVED" : "REJECTED";
  if (lwd) resignation.lastWorkingDay = lwd;
  await resignation.save();

  res.status(200).json({ data: resignation });
});

router.get("/exit_responses", auth, isAdmin, async (req, res) => {
  const responses = await ExitInterview.find();
  res.status(200).json({ data: responses });
});

export default router;
