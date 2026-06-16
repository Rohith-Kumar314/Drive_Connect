import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    capacity: {
      type: Number,
      enum: [2, 4, 5, 6, 7, 8],
      required: true,
    },

    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric"],
      required: true,
    },

    pricePerHour: {
      type: Number,
      default: 150,
      required: true,
    },

    color: String,

    images: {
      type: [String],
      default: [],
    },

    hasAc: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Vehicle", vehicleSchema);