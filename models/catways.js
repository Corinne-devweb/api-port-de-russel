const mongoose = require("mongoose");

const catwaySchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    catwayType: {
      type: String,
      required: true,
      enum: ["petit", "moyen", "grand"],
    },
    catwayState: {
      type: String,
      required: true,
      enum: ["libre", "occupé", "indisponible"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Catway", catwaySchema);
