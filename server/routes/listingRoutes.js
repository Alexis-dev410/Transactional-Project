const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");

// GET /api/listings (with filters + pagination)
router.get("/", async (req, res) => {
  try {
    const { city, minPrice, maxPrice, type, page = 1 } = req.query;

    let filter = {};

    if (city) filter["address.market"] = city;
    if (type) filter["property_type"] = type;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNumber = Number(page) || 1;
    const limit = 10;

    const listings = await Listing.find(filter)
      .limit(limit)
      .skip((pageNumber - 1) * limit);

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/listings/:id
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;