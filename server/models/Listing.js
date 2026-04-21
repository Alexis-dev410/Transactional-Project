const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  name: String,
  description: String,
  property_type: String,
  room_type: String,

  accommodates: Number,
  bedrooms: Number,
  beds: Number,
  bathrooms: Number,

  price: Number,
  cleaning_fee: Number,

  amenities: [String],

  images: {
    picture_url: String
  },

  host: {
    host_id: String
  },

  address: {
    street: String,
    suburb: String,
    government_area: String,
    market: String,
    country: String,
    country_code: String,
    location: {
      type: {
        type: String,
        default: "Point"
      },
      coordinates: [Number]
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("Listing", listingSchema);