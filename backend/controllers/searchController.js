const pool = require("../db");

const searchProducts = async (req, res, next) => {
  try {
    const keyword = req.query.q || "";

    const result = await pool.query(
      `
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
        p.name ILIKE $1
        OR p.brand ILIKE $1
        OR p.description ILIKE $1
        OR c.name ILIKE $1
      ORDER BY p.id ASC
      `,
      [`%${keyword}%`]
    );

    await pool.query(
      `
      INSERT INTO search_logs (keyword)
      VALUES ($1)
      `,
      [keyword]
    );

    res.json({
      keyword,
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchProducts,
};