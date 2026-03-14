import { Router } from "express";
import { pool } from "../database";
import { Article, ArticleWithUser } from "../interfaces";
import { ResultSetHeader } from "mysql2";
import {
  authenticateToken,
  validateArticle,
} from "../middleware/auth-validation";

const router = Router();

// --- GET routes --- //

// GET all articles with Author information

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles
 *     description: Returns a paginated list of articles including author information.
 *     tags:
 *       - Articles
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
 *         description: Number of articles to return per page.
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
 *                   username:
 *                     type: string
 *                     example: johndoe
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: john@example.com
 *       500:
 *         description: Failed to fetch articles.
 */
router.get("/", async (req, res) => {
  try {
    //pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    //calculate offset
    const offset = (page - 1) * limit;

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
      ORDER BY a.created_at DESC
      limit ?
      offset ?
    `,
      [limit.toString(), offset.toString()],
    );

    const articles = rows as ArticleWithUser[];
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// --- POST Routes --- //

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create an article
 *     description: Creates a new article for the authenticated user.
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 example: How to use Express
 *               body:
 *                 type: string
 *                 minLength: 1
 *                 example: Article content
 *               category:
 *                 type: string
 *                 minLength: 1
 *                 example: Backend
 *     responses:
 *       201:
 *         description: Article created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Article created successfully!
 *                 article:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     title:
 *                       type: string
 *                       example: How to use Express
 *                     body:
 *                       type: string
 *                       example: Article content
 *                     category:
 *                       type: string
 *                       example: Backend
 *                     submitted_by:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Missing or malformed access token.
 *       403:
 *         description: Invalid or expired token.
 *       500:
 *         description: Failed to create article.
 */
router.post("/", authenticateToken, validateArticle, async (req, res) => {
  try {
    const { title, body, category } = req.body;
    const userId = (req as any).user.id;

    //Insert new article into database
    const [result]: [ResultSetHeader, any] = await pool.execute(
      "insert into articles (title, body, category, submitted_by) VALUES (?, ?, ?, ?)",
      [title, body, category, userId],
    );

    const article: Article = {
      id: result.insertId,
      title,
      body,
      category,
      submitted_by: userId,
    };
    res.status(201).json({
      message: "Article created successfully!",
      article: article,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to create article",
    });
  }
});

export default router;
