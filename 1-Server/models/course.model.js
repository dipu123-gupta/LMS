import { model, Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [8, "Title must be at least 8 characters"],
      maxlength: [80, "Title must be less than 80 characters"],
      trim: true,
    },

    description: {
      type: String,
      required: true,
      minlength: [8, "Description must be at least 8 characters"],
      maxlength: [200, "Description must be less than 200 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
    },

    thumbnail: {
      public_id: {
        type: String,
        default: "",
      },
      secure_url: {
        type: String,
        default: "",
      },
    },

    lectures: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          required: true,
        },
        lecture: {
          public_id: {
            type: String,
            required: true,
          },
          secure_url: {
            type: String,
            required: true,
          },
        },
      },
    ],

    numberOfLectures: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Course = model("Course", courseSchema);
export default Course;
