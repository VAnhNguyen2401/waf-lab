const pool = require("../db");

const getAllProducts = async (req, res, next) => {
  try {
    const result = await pool.query(`
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
      ORDER BY p.id ASC
    `);

    res.json({
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Invalid product ID",
      });
    }

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
      WHERE p.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
};