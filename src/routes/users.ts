import { Router } from "express";
import { ResultSetHeader } from "mysql2";
import { pool } from "../database";
import { User, Article, ArticleWithUser } from "../interfaces";
import {
  validateUserId,
  validateRequiredUserData,
  validatePartialUserData,
} from "../middleware/user-validation";

const router = Router();

// --- GET Routes --- //

//GET all users
router.get("/", async (req, res) => {
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

//GET single user by ID
router.get("/:id", validateUserId, async (req, res) => {
  try {
    const userId = Number(req.params.id);

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

//GET single user with articles
router.get("/:id/articles", validateUserId, async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const [rows] = await pool.execute(
      `
      SELECT 
        a.id,
        a.title,
        a.body,
        a.category,
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

router.get("/:id/articles-with-author", validateUserId, async (req, res) => {
  const userId = Number(req.params.id);

  const [rows] = await pool.execute(
    `
    SELECT
     a.id,
     a.title,
     a.body,
     a.category,
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

// --- POST routes --- //

// CREATE new USER

router.post("/", validateRequiredUserData, async (req, res) => {
  try {
    const { username, email } = req.body;

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
router.put(
  "/:id",
  validateUserId,
  validateRequiredUserData,
  async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const { username, email } = req.body;

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
  },
);

// --- PATCH ROUTES --- //

// Partially update a user
router.patch(
  "/:id",
  validateUserId,
  validatePartialUserData,
  async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const { username, email } = req.body;

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
      const [result]: [ResultSetHeader, any] = await pool.execute(
        query,
        values,
      );

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
  },
);

//--- DELETE ROUTES --- //

// Delete a user
router.delete("/:id", validateUserId, async (req, res) => {
  try {
    const userId = Number(req.params.id);

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

export default router;
