const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  photoPath: String
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);