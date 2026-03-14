import { Router } from "express";
import { ResultSetHeader } from "mysql2";
import { pool } from "../database";
import { UserResponse, Article, ArticleWithUser } from "../interfaces";
import {
  validateUserId,
  validateRequiredUserData,
  validatePartialUserData,
} from "../middleware/user-validation";
import { authenticateToken } from "../middleware/auth-validation";

const router = Router();

// --- GET Routes --- //

//GET all users
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns a paginated list of users.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number to fetch.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of users to return per page.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: johndoe
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: john@example.com
 *       500:
 *         description: Failed to fetch users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: failed to fetch users
 */
router.get("/", async (req, res) => {
  try {
    //pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    //calculate offset
    const offset = (page - 1) * limit;

    //fetch users
    const [rows] = await pool.execute(
      "SELECT id, username, email FROM users limit ? offset?",
      [limit.toString(), offset.toString()],
    );
    const users = rows as UserResponse[];

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
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Returns a single user without password data.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: User ID.
 *     responses:
 *       200:
 *         description: User found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: john@example.com
 *       400:
 *         description: Invalid user ID.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failed to fetch user.
 */
router.get("/:id", validateUserId, async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const [rows] = await pool.execute(
      "SELECT id, username, email from users where id = ?",
      [userId],
    );

    const users = rows as UserResponse[];

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
/**
 * @swagger
 * /users/{id}/articles:
 *   get:
 *     summary: Get articles by user
 *     description: Returns all articles submitted by the specified user.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: User ID.
 *     responses:
 *       200:
 *         description: Articles returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 10
 *                   title:
 *                     type: string
 *                     example: How to use Express
 *                   body:
 *                     type: string
 *                     example: Article content
 *                   category:
 *                     type: string
 *                     example: Backend
 *                   submitted_by:
 *                     type: integer
 *                     example: 1
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-03-14T10:00:00.000Z
 *       400:
 *         description: Invalid user ID.
 *       500:
 *         description: Failed to fetch user articles.
 */
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

/**
 * @swagger
 * /users/{id}/articles-with-author:
 *   get:
 *     summary: Get articles by user with author details
 *     description: Returns articles for a specific user together with the author's username and email.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: User ID.
 *     responses:
 *       200:
 *         description: Articles with author data returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 10
 *                   title:
 *                     type: string
 *                     example: How to use Express
 *                   body:
 *                     type: string
 *                     example: Article content
 *                   category:
 *                     type: string
 *                     example: Backend
 *                   submitted_by:
 *                     type: integer
 *                     example: 1
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-03-14T10:00:00.000Z
 *                   username:
 *                     type: string
 *                     example: johndoe
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: john@example.com
 *       400:
 *         description: Invalid user ID.
 *       500:
 *         description: Failed to fetch user articles with author details.
 */
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

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user record without authentication.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: john@example.com
 *       400:
 *         description: Validation failed.
 *       500:
 *         description: Failed to create user.
 */
router.post("/", validateRequiredUserData, async (req, res) => {
  try {
    const { username, email } = req.body;

    //Insert new user into database
    const [result]: [ResultSetHeader, any] = await pool.execute(
      "insert into users (username, email) VALUES (?, ?)",
      [username, email],
    );

    const user: UserResponse = { id: result.insertId, username, email };
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
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Replace a user
 *     description: Fully updates a user. The authenticated user must match the path ID.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: User ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Missing or malformed access token.
 *       403:
 *         description: Authenticated user is not allowed to update this account.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failed to update user.
 */
router.put(
  "/:id",
  authenticateToken,
  validateUserId,
  validateRequiredUserData,
  async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const { username, email } = req.body;

      //Check if user is trying to update own account
      if (req.user!.id !== userId) {
        return res.status(403).json({
          error: "Users can only update their own account!",
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

      const user: UserResponse = { id: userId, username, email };
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
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Partially update a user
 *     description: Updates one or more user fields. The authenticated user must match the path ID.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: User ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Missing or malformed access token.
 *       403:
 *         description: Authenticated user is not allowed to update this account.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failed to update user.
 */
router.patch(
  "/:id",
  authenticateToken,
  validateUserId,
  validatePartialUserData,
  async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const { username, email } = req.body;

      //Check if user is trying to update own account
      if (req.user!.id !== userId) {
        return res.status(403).json({
          error: "Users can only update their own account!",
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
      const users = rows as UserResponse[];
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
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user account. The authenticated user must match the path ID.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: User ID.
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       400:
 *         description: Invalid user ID.
 *       401:
 *         description: Missing or malformed access token.
 *       403:
 *         description: Authenticated user is not allowed to delete this account.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failed to delete user.
 */
router.delete("/:id", validateUserId, authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.id);

    //Check if user is trying to delete own account
    if (req.user!.id !== userId) {
      return res.status(403).json({
        error: "Users can only delete their own account!",
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

export default router;
