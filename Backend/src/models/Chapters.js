import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
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
    collection: "chapters",
  }
);


// A subject cannot have two chapters with the same slug
chapterSchema.index({ subjectId: 1, slug: 1 }, { unique: true });


const Chapter = mongoose.model("Chapter", chapterSchema);

export default Chapter;