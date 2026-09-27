const pool = require("../db");

const createReview = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    const { username, content } = req.body;

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        error: "Invalid product ID",
      });
    }

    if (!username || !content) {
      return res.status(400).json({
        error: "username and content are required",
      });
    }

    const product = await pool.query(
      `
      SELECT id
      FROM products
      WHERE id = $1
      `,
      [productId]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    /*
     * INTENTIONALLY UNSANITIZED
     *
     * Review content được lưu nguyên bản để phục vụ
     * Stored XSS research lab.
     *
     * SQL query vẫn parameterized => không phải SQL Injection.
     */
    const result = await pool.query(
      `
      INSERT INTO reviews (
        product_id,
        username,
        content
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        product_id,
        username,
        content,
        created_at
      `,
      [productId, username, content]
    );

    console.log("[REVIEW USERNAME]", username);
    console.log("[REVIEW CONTENT]", content);

    res.status(201).json({
      message: "Review submitted successfully",
      review: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        error: "Invalid product ID",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        product_id,
        username,
        content,
        created_at
      FROM reviews
      WHERE product_id = $1
      ORDER BY created_at DESC
      `,
      [productId]
    );

    /*
     * Stored content được trả nguyên lại client.
     */
    res.json({
      count: result.rows.length,
      reviews: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviews,
};