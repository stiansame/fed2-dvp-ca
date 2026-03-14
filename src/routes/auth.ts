import "dotenv/config";
import { Router } from "express";
import bcrypt from "bcrypt";
import { ResultSetHeader } from "mysql2";
import { pool } from "../database";
import {
  validateRegistration,
  validateLogin,
} from "../middleware/auth-validation";
import { User, UserResponse } from "../interfaces";
import { generateToken } from "../utils/jwt";

const router = Router();

// --- REGISTER ENDPOINT -- //
router.post("/register", validateRegistration, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Check if user exists
    const [rows] = await pool.execute(
      "SELECT id from users where email = ? or username =?",
      [email, username],
    );
    const existingUsers = rows as User[];

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: "User with this email or username already exists.",
      });
    }

    //Hash password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //CREATE user in DB
    const [result]: [ResultSetHeader, any] = await pool.execute(
      "insert into users (username, email, password_hash) values (?, ?,?)",
      [username, email, hashedPassword],
    );

    //Return userinfo without password
    const userResponse: UserResponse = {
      id: result.insertId,
      username,
      email,
    };

    res.status(201).json({
      message: "User registered successfully!",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error", error);
    res.status(500).json({
      error: "Failed to register user!",
    });
  }
});

// --- LOGIN ENDPOINT --- //
router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [rows] = await pool.execute(
      "SELECT id, username, email, password_hash AS password FROM users WHERE email = ?",
      [email],
    );
    const users = rows as User[];

    if (users.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = users[0];

    // Verify password using bcrypt
    const validPassword = await bcrypt.compare(password, user.password!);

    if (!validPassword) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user info and token
    const userResponse: UserResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    res.json({
      message: "Login successful",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Failed to log in",
    });
  }
});

export default router;
