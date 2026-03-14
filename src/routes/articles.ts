import { Router } from "express";
import { pool } from "../database";
import { ArticleWithUser } from "../interfaces";

const router = Router();

// --- GET routes --- //

// GET all articles with Author information

router.get("/", async (req, res) => {
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

export default router;
