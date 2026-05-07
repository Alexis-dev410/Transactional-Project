const upload = require("../config/multer");
const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const authMiddleware = require("../middleware/authMiddleware");


F
// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE review
router.post("/", authMiddleware, upload.single("photo"), async (req, res) => {
    try {
    const { listingId, rating, comment } = req.body;

    // one review per user per listing
    const existing = await Review.findOne({
      listingId,
      userId: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    const review = new Review({
      listingId,
      userId: req.user.id,
      rating,
      comment,
      photoPath: req.file ? req.file.filename : null,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// UPDATE review
router.put("/:id", authMiddleware, async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review || review.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  review.rating = req.body.rating;
  review.comment = req.body.comment;

  await review.save();
  res.json(review);
});

// DELETE review
router.delete("/:id", authMiddleware, async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review || review.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await review.deleteOne();
  res.json({ message: "Deleted" });
});

module.exports = router;