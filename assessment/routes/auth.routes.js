import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/**
 * INIT HR (called once before tests)
 */
router.post("/init-hr", async (req, res) => {
  const exists = await User.findOne({ role: "HR" });
  if (!exists) {
    const hashed = await bcrypt.hash("admin", 10);
    await User.create({
      username: "admin",
      password: hashed,
      role: "HR",
    });
  }
  res.json({ message: "HR ready" });
});

/**
 * EMPLOYEE REGISTER
 */
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const exists = await User.findOne({ username });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({
    username,
    password: hashed,
    role: "EMPLOYEE",
  });

  res.status(201).json({ message: "User registered successfully" });
});

/**
 * LOGIN (HR + EMPLOYEE)
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });

  // AUTO-CREATE ADMIN (VERY IMPORTANT)
  if (!user && username === "admin") {
    const hashed = await bcrypt.hash("admin", 10);
    user = await User.create({
      username: "admin",
      password: hashed,
      role: "HR",
    });
  }

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

export default router;
