import { Router } from "express";
import { pool } from "../database";
import { Article, ArticleWithUser } from "../interfaces";
import { ResultSetHeader } from "mysql2";

const router = Router();

// --- GET routes --- //

// GET all articles with Author information

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

export default router;

// --- POST Routes --- //

/* router.post("/", async (req, res) => {
  try {
    const { title, body, category, submitted_by } = req.body;

    //Insert new article into database
    const [result]: [ResultSetHeader, any] = await pool.execute(
      "insert into articles (title, body, category, submitted_by) VALUES (?, ?, ?, ?)",
      [title, body, category],
    );

    const article: Article = {
      id: result.insertId,
      title,
      body,
      category,
      submitted_by,
    };
    res.status(201).json(article);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to create article",
    });
  }
}); */
