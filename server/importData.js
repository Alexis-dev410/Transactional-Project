const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

const Listing = require("./models/Listing");

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });

// Helper to clean MongoDB decimal format
const cleanNumber = (value) => {
  if (!value) return null;

  if (typeof value === "object" && value.$numberDecimal) {
    return Number(value.$numberDecimal);
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return value;
};

// Transform each listing
const transformListing = (item) => {
  return {
    name: item.name || "",
    description: item.description || "",
    property_type: item.property_type || "",
    room_type: item.room_type || "",

    accommodates: cleanNumber(item.accommodates),
    bedrooms: cleanNumber(item.bedrooms),
    beds: cleanNumber(item.beds),
    bathrooms: cleanNumber(item.bathrooms),

    price: cleanNumber(item.price),
    cleaning_fee: cleanNumber(item.cleaning_fee),

    amenities: item.amenities || [],

    images: {
      picture_url: item.images?.picture_url || ""
    },

    host: {
      host_id: item.host?.host_id || ""
    },

    address: {
      street: item.address?.street || "",
      suburb: item.address?.suburb || "",
      government_area: item.address?.government_area || "",
      market: item.address?.market || "",
      country: item.address?.country || "",
      country_code: item.address?.country_code || "",
      location: {
        type: "Point",
        coordinates: item.address?.location?.coordinates || [0, 0]
      }
    }
  };
};

// Import function
const importData = async () => {
  try {
    console.log("📂 Reading JSON file...");

    const rawData = fs.readFileSync("./data/listings.json", "utf-8");
    const jsonData = JSON.parse(rawData);

    console.log(`📊 Found ${jsonData.length} listings`);

    const cleanedData = jsonData.map(transformListing);

    console.log("🧹 Clearing existing listings...");
    await Listing.deleteMany();

    console.log("⬆️ Inserting cleaned data...");
    await Listing.insertMany(cleanedData);

    console.log("🎉 Import successful!");
    process.exit();
  } catch (err) {
    console.error("❌ Import failed:", err);
    process.exit(1);
  }
};

importData();