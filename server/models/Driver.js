import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id required"],
      unique: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [21, "Should be over 21 years"],
    },
    licenceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    experienceYears: Number,
    city: String,
    hourlyRate: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currentStatus: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "offline",
    },
    rating: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true },
);

export const Driver = mongoose.model("Driver", driverSchema);