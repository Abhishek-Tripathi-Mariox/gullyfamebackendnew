const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReelSchema = new Schema(
  {
    video_url: {
      type: String,
      required: true,
    },
    thumbnail_url: {
      type: String,
      default: "",
    },
    caption: {
      type: String,
      default: "",
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    competition: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      default: null,
    },
    music: {
      id: { type: String, default: "" },
      name: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    stats: {
      votes: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      saves: { type: Number, default: 0 },
      tips: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

ReelSchema.index({ competition: 1, createdAt: -1 });
ReelSchema.index({ author: 1 });
ReelSchema.index({ "stats.votes": -1 });

module.exports = mongoose.model("Reel", ReelSchema);
