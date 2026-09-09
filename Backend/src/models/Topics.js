import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "topics",
  }
);

// A chapter cannot have two topics with the same slug
topicSchema.index({ chapterId: 1, slug: 1 }, { unique: true });

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;