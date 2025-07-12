import sendToken from "../utils/sendToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// -------- Signup --------
export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  const credits = 5;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ messgae: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      credits,
    });

    sendToken(res, user._id);
    res.status(201).json({
      user: { username, email, credits, id: user._id },
      message: "Signup succesful",
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// -------- Login --------
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    sendToken(res, user._id);
    res.json({
      user: {
        username: user.username,
        email: user.email,
        credits: user.credits,
        id: user._id,
      },
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
