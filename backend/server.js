const express = require("express");
const pool = require("./db");
const productRoutes = require("./routes/products");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const PORT = process.env.PORT || 3000;
const searchRoutes = require("./routes/search");
const authRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/reviews");
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));





app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "backend",
  });
});


app.get("/db-health", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS current_time"
    );

    res.json({
      status: "ok",
      database: "connected",
      time: result.rows[0].current_time,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});


app.use("/api/products", productRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", reviewRoutes);


app.use(notFound);
app.use(errorHandler);


app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Football Sport Shop Backend listening on port ${PORT}`
  );
});