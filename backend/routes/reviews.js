const express = require("express");

const {
  createReview,
  getReviews,
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/:id/reviews", getReviews);

router.post("/:id/reviews", createReview);

module.exports = router;