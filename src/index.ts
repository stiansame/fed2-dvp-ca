import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { pool } from "./database";
import { ResultSetHeader } from "mysql2";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Enable Built in middleware
app.use(cors());
app.use(express.json());

//Interfaces

interface User {
  id: number;
  username: string;
  email: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  submitted_by: string;
  created_at: string;
}

interface ArticleWithUser extends Article {
  username: string;
  email: string;
}

// GET routes

//GET all users
app.get("/users", async (req, res) => {
  try {
    //pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    //calculate offset
    const offset = (page - 1) * limit;

    //fetch users
    const [rows] = await pool.execute("SELECT * FROM users limit ? offset?", [
      limit.toString(),
      offset.toString(),
    ]);
    const users = rows as User[];

    //render users
    res.json(users);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      error: "failed to fetch users",
    });
  }
});

//Get single user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const [rows] = await pool.execute(
      "select id, username, email from users where id = ?",
      [userId],
    );

    const users = rows as User[];

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    res.json(user);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to fetch user",
    });
  }
});

// GET all articles with Author information

app.get("/articles", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        a.id,
        a.title,
        a.content,
        a.submitted_by,
        a.created_at,
        u.username,
        u.email
      FROM articles a
      INNER JOIN users u ON a.submitted_by = u.id
      ORDER BY a.created_at DESC
    `);

    const articles = rows as ArticleWithUser[];
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

//GET all articles by specific user

app.get("/users/:id/articles", async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const [rows] = await pool.execute(
      `
      SELECT 
        a.id,
        a.title,
        a.content,
        a.submitted_by,
        a.created_at
      FROM articles a
      WHERE a.submitted_by = ?
      ORDER BY a.created_at DESC
    `,
      [userId],
    );

    const articles = rows as Article[];
    res.json(articles);
  } catch (error) {
    console.error("Error fetching user articles:", error);
    res.status(500).json({ error: "Failed to fetch user articles" });
  }
});

//GET articles by specific user with Author-info

app.get("/users/:id/articles-with-author", async (req, res) => {
  const userId = Number(req.params.id);

  const [rows] = await pool.execute(
    `
    SELECT
     a.id,
     a.title,
     a.content,
     a.submitted_by,
     a.created_at,
     u.username,
     u.email
    FROM articles a
    INNER JOIN users u ON a.submitted_by = u.id
    WHERE u.id = ?
  `,
    [userId],
  );

  const articles = rows as ArticleWithUser[];
  res.json(articles);
});

// --- POST ROUTES --- //

// CREATE new USER

app.post("/users", async (req, res) => {
  try {
    const { username, email } = req.body;

    //Validation
    if (!username || !email) {
      return res.status(400).json({
        error: "Username and email are required",
      });
    }

    //Insert new user into database
    const [result]: [ResultSetHeader, any] = await pool.execute(
      "insert into users (username, email) VALUES (?, ?)",
      [username, email],
    );

    const user: User = { id: result.insertId, username, email };
    res.status(201).json(user);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to create user",
    });
  }
});

// --- PUT ROUTES --- //

// Update a user (full replacement)
app.put("/users/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { username, email } = req.body;

    // Validate ID
    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    // Validate required fields
    if (!username || !email) {
      return res.status(400).json({
        error: "Username and email are required",
      });
    }

    // Update the user in the database
    const [result]: [ResultSetHeader, any] = await pool.execute(
      "UPDATE users SET username = ?, email = ? WHERE id = ?",
      [username, email, userId],
    );

    // Check if user was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const user: User = { id: userId, username, email };
    res.json(user);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to update user",
    });
  }
});

// --- PATCH ROUTES --- //

// Partially update a user
app.patch("/users/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { username, email } = req.body;

    // Validate ID
    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    // Check that at least one field is provided
    if (!username && !email) {
      return res.status(400).json({
        error: "At least one field (username or email) is required",
      });
    }

    // Build dynamic UPDATE query based on provided fields
    const fieldsToUpdate = [];
    const values = [];

    if (username) {
      fieldsToUpdate.push("username = ?");
      values.push(username);
    }

    if (email) {
      fieldsToUpdate.push("email = ?");
      values.push(email);
    }

    values.push(userId);

    //UPDATE provided fields
    const query = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
    const [result]: [ResultSetHeader, any] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Get the updated user to return to the frontend
    const [rows] = await pool.execute(
      "SELECT id, username, email FROM users WHERE id = ?",
      [userId],
    );
    const users = rows as User[];
    const user = users[0];

    res.json(user);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to update user",
    });
  }
});

//--- DELETE ROUTES --- //

// Delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);

    // Validate ID
    if (isNaN(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    // Delete the user from the database
    const [result]: [ResultSetHeader, any] = await pool.execute(
      "DELETE FROM users WHERE id = ?",
      [userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Return 204 No Content - successful deletion with no response body
    res.status(204).send();
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to delete user",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
