import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Database } from "../config/db";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../services/email.service";
import { generateVerificationCode } from "../utils/codeGenerator";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";
const TOKEN_EXPIRES_IN = "7d";

export async function register(req: Request, res: Response) {
  const { name, email, password, ref } = req.body;

  if (!name || !email || !password)
    return res.json({
      success: false,
      message: "Name, email, and password are required",
    });

  try {
    const isExistingUser = await Database.getUserByEmail(email);
    if (isExistingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await Database.createUser(name, email, hashedPassword);

    const code = generateVerificationCode();
    await Promise.all([
      Database.saveVerificationCode(userId, code),
      sendVerificationEmail(email, code),
    ]);
    if (ref) await Database.addReferral(ref, userId);
    return res.json({
      success: true,
      message:
        "Registration successful. Check your email for verification code.",
      user: { email, verified: false },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  const { email, code } = req.body;
  if (!email || !code)
    return res.json({ success: false, message: "Email and code required" });

  try {
    const user = await Database.getUserByEmail(email);
    if (!user) return res.json({ success: false, message: "User not found" });

    const isValid = await Database.verifyCode(user.id, code);
    if (!isValid)
      return res.json({ success: false, message: "Invalid or expired code" });

    await Database.verifyUser(email);

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRES_IN,
    });

    res.json({
      success: true,
      message: "Email verified successfully",
      token,
      user: { email, verified: true },
    });
  } catch (error: any) {
    console.error("Verify email error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({ success: false, message: "Email and password required" });

  try {
    const user = await Database.getUserByEmail(email);
    if (!user)
      return res.json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid credentials" });

    if (!user.is_verified)
      return res.json({
        success: false,
        message: "Please verify your email",
        needsVerification: true,
      });

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRES_IN,
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function requestReset(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "Email required" });

  try {
    const user = await Database.getUserByEmail(email);
    if (!user) return res.json({ success: false, message: "User not found" });

    const token = generateVerificationCode();

    await Database.saveResetCode(user.id, token);

    await sendPasswordResetEmail(email, token);

    res.json({
      success: true,
      message: `If the account exists, a reset link was sent to ${email}`,
    });
  } catch (error: any) {
    console.error("Request reset error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function resetPassword(req: Request, res: Response) {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword)
    return res.json({
      success: false,
      message: "Email, code, and new password required",
    });

  if (newPassword.length < 6)
    return res.json({
      success: false,
      message: "Password must be at least 6 characters",
    });

  try {
    const user = await Database.getUserByEmail(email);
    if (!user) return res.json({ success: false, message: "User not found" });

    const isValid = await Database.verifyResetCode(user.id, token);
    if (!isValid)
      return res.json({
        success: false,
        message: "Invalid or expired reset code",
      });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Database.updateUserPassword(user.id, hashedPassword);

    res.json({ success: true, message: "Password reset successful", email });
  } catch (error: any) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function resendVerification(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "Email required" });

  try {
    const user = await Database.getUserByEmail(email);
    if (!user) return res.json({ success: false, message: "User not found" });

    const code = generateVerificationCode();
    await Database.saveVerificationCode(user.id, code);

    await sendVerificationEmail(email, code);

    res.json({
      success: true,
      message: "New verification code sent",
      email,
    });
  } catch (error: any) {
    console.error("Resend verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
