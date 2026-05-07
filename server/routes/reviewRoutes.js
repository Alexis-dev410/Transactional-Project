const upload = require("../config/multer");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Review = require("../models/Review");
const authMiddleware = require("../middleware/authMiddleware");


// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "_id firstName lastName")
      .populate("listingId", "_id name");

    res.json(reviews);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// CREATE review
router.post(
  "/",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { listingId, rating, comment } = req.body;

      // check existing review
      const existing = await Review.findOne({
        listingId: new mongoose.Types.ObjectId(listingId),
        userId: req.user._id,
      });

      if (existing) {
        return res.status(400).json({
          message: "Already reviewed",
        });
      }

      const review = new Review({
        listingId: new mongoose.Types.ObjectId(listingId),
        userId: req.user._id,
        rating,
        comment,
        photoPath: req.file ? req.file.filename : null,
      });

      await review.save();

      const populatedReview = await Review.findById(review._id)
        .populate("userId", "_id firstName lastName");

      res.status(201).json(populatedReview);

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// UPDATE review
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    review.rating = req.body.rating;
    review.comment = req.body.comment;

    await review.save();

    res.json(review);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// DELETE review
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    await review.deleteOne();

    res.json({
      message: "Deleted",
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;