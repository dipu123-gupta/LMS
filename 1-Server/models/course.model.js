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

    price: {
      type: Number,
      required: true, // free course ke liye 0 rakh sakte ho
      default: 0,
    },
    discount: {
      type: Number, // %
      default: 0,
      min: 0,
      max: 100,
    },
    finalPrice: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
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

courseSchema.pre("save", function () {
  if (this.price === 0) {
    this.isFree = true;
    this.finalPrice = 0;
  } else {
    this.isFree = false;
    this.finalPrice =
      this.price - Math.floor((this.price * this.discount) / 100);
  }
});


const Course = model("Course", courseSchema);
export default Course;
