const pool = require("../db");

const searchProducts = async (req, res, next) => {
  try {
    const keyword = req.query.q || "";

    /*
     * INTENTIONALLY VULNERABLE
     * SQL Injection lab:
     * User input is directly concatenated into SQL.
     */

    console.log("[SEARCH INPUT]", keyword);

    // Log input independently from vulnerable SQL execution
    await pool.query(
      `
      INSERT INTO search_logs (keyword)
      VALUES ($1)
      `,
      [keyword]
    );

    const sql = `
      SELECT
        p.id,
        p.name,
        p.brand,
        p.price,
        p.stock,
        p.description,
        c.name AS category
      FROM products AS p
      LEFT JOIN categories AS c
        ON p.category_id = c.id
      WHERE
        p.name ILIKE '%${keyword}%'
        OR p.brand ILIKE '%${keyword}%'
        OR p.description ILIKE '%${keyword}%'
        OR c.name ILIKE '%${keyword}%'
      ORDER BY p.id ASC
    `;

    console.log("[SQL QUERY]", sql);

    const result = await pool.query(sql);

    res.json({
      keyword,
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error) {
    console.error("[SEARCH ERROR]", error.message);
    next(error);
  }
};

module.exports = {
  searchProducts,
};