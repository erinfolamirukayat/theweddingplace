import { Request, Response } from "express";
import { pool } from "../index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/email";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://celebron.netlify.app";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, first_name, last_name, how_heard } = req.body;
  if (!email || !password || !first_name || !last_name || !how_heard) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, first_name, last_name, how_heard, verification_token, is_verified) VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING id, email, created_at, first_name, last_name, how_heard, is_verified",
      [email, hashed, first_name, last_name, how_heard, verificationToken]
    );
    
    const user = result.rows[0];
    const verificationLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    
    sendVerificationEmail(email, first_name, verificationLink).catch(err => {
      console.error("Failed to send verification email:", err);
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({ token, user });
  } catch (err: any) {
    console.error("Registration error:", err);
    if (err.code === "23505") {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { email, token } = req.query;
  if (!email || !token) {
    res.status(400).json({ error: "Email and token are required" });
    return;
  }
  
  try {
    const result = await pool.query(
      "UPDATE users SET is_verified = true, verification_token = NULL WHERE email = $1 AND verification_token = $2 RETURNING id",
      [email, token]
    );
    
    if (result.rows.length === 0) {
      res.status(400).json({ error: "Invalid or expired verification token" });
      return;
    }
    
    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resendVerification = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  
  try {
    const result = await pool.query("SELECT email, first_name, is_verified FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    const user = result.rows[0];
    if (user.is_verified) {
      res.status(400).json({ error: "Email is already verified" });
      return;
    }
    
    const verificationToken = crypto.randomBytes(32).toString("hex");
    await pool.query("UPDATE users SET verification_token = $1 WHERE id = $2", [verificationToken, userId]);
    
    const verificationLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;
    
    sendVerificationEmail(user.email, user.first_name, verificationLink).catch(err => {
      console.error("Failed to resend verification email:", err);
    });
    
    res.json({ message: "Verification email sent" });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user.id, email: user.email, is_verified: user.is_verified, first_name: user.first_name, last_name: user.last_name } });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const result = await pool.query("SELECT id, email, first_name, last_name, how_heard, is_verified, notification_preference FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePreferences = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { notification_preference } = req.body;
  if (!notification_preference) {
    res.status(400).json({ error: "notification_preference is required" });
    return;
  }
  try {
    const result = await pool.query(
      "UPDATE users SET notification_preference = $1 WHERE id = $2 RETURNING id, email, first_name, last_name, notification_preference, is_verified",
      [notification_preference, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { first_name, last_name, how_heard } = req.body;
  if (!first_name || !last_name || !how_heard) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  try {
    const result = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, how_heard = $3 WHERE id = $4 RETURNING id, email, first_name, last_name, how_heard, is_verified",
      [first_name, last_name, how_heard, userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      res.json({ message: "If that email exists in our system, a reset link has been sent." });
      return;
    }

    const userId = userResult.rows[0].id;
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

    await pool.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [userId]);

    await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [userId, token, expiresAt]
    );

    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    await sendPasswordResetEmail(email, resetLink);

    res.json({ message: "If that email exists in our system, a reset link has been sent." });
  } catch (err) {
    console.error("ForgotPassword error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, token, password } = req.body;
  if (!email || !token || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT prt.*, u.id as user_id 
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE u.email = $1 AND prt.token = $2 AND prt.expires_at > $3`,
      [email, token, new Date()]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ error: "Invalid or expired reset token" });
      return;
    }

    const userId = result.rows[0].user_id;
    const hashed = await bcrypt.hash(password, 10);

    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hashed, userId]);
    await pool.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [userId]);

    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("ResetPassword error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
