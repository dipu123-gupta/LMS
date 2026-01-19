

# 📘 Course Schema 

## 📌 Overview

Ye schema **Learning Management System (LMS)** ke liye banaya gaya hai.
Iska use **courses create, manage, aur deliver** karne ke liye hota hai jisme **lectures, thumbnails, categories aur creator info** hoti hai.

---

## 🧱 Schema Structure

### 1️⃣ Course Basic Information

```js
title: {
  type: String,
  required: true,
  minlength: 8,
  maxlength: 80,
  trim: true,
}
```

**Explanation:**

* Course ka main title
* Minimum 8 aur maximum 80 characters
* `trim` → extra spaces remove karta hai

👉 Example: `Complete MERN Stack Course`

---

```js
description: {
  type: String,
  required: true,
  minlength: 8,
  maxlength: 200,
}
```

**Explanation:**

* Course ka short summary
* Course listing page par dikhta hai

---

### 2️⃣ Category

```js
category: {
  type: String,
  required: true,
  enum: ["Web", "Mobile", "Data Science", "AI", "DevOps"],
}
```

**Explanation:**

* Course kis domain ka hai
* `enum` se **fixed categories** ensure hoti hain

👉 Galat category DB me nahi jaa sakti

---

### 3️⃣ Thumbnail (Course Image)

```js
thumbnail: {
  public_id: String,
  secure_url: String,
}
```

**Explanation:**

* Cloudinary ke liye optimized structure
* `public_id` → image delete/update ke liye
* `secure_url` → frontend display ke liye

---

### 4️⃣ Lectures (Embedded Documents)

```js
lectures: [
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    lecture: {
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true },
    },
  },
],
```

**Explanation:**

* Ek course ke multiple lectures
* Har lecture ke paas:

  * Title
  * Description
  * Video file (Cloudinary)

👉 Small–medium LMS ke liye best approach

---

### 5️⃣ Creator Information

```js
createdBy: {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true,
}
```

**Explanation:**

* Kis admin ne course banaya
* `ref: "User"` se **populate** possible hota hai

👉 Admin dashboard me creator details dikha sakte ho

---

### 6️⃣ Timestamps

```js
{ timestamps: true }
```

**Explanation:**

* Automatically add hota hai:

  * `createdAt`
  * `updatedAt`

---

### 7️⃣ Virtual Field – Number of Lectures

```js
courseSchema.virtual("numberOfLectures").get(function () {
  return this.lectures.length;
});
```

**Explanation:**

* DB me store nahi hota
* Runtime par calculate hota hai
* Data mismatch ka risk nahi

---

## 📦 Full Schema Code

```js
import { model, Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 80,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 200,
    },

    category: {
      type: String,
      required: true,
      enum: ["Web", "Mobile", "Data Science", "AI", "DevOps"],
    },

    thumbnail: {
      public_id: String,
      secure_url: String,
    },

    lectures: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        lecture: {
          public_id: { type: String, required: true },
          secure_url: { type: String, required: true },
        },
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

courseSchema.virtual("numberOfLectures").get(function () {
  return this.lectures.length;
});

export default model("Course", courseSchema);
```

---

## 🔒 Security & Access Control (Suggested)

* **Admin only** → create/update/delete course
* **Subscribed users** → access paid lectures
* **Free preview lectures** → open for all

---

## 🧠 Interview-Ready Explanation (1 Minute)

> “We designed the Course schema using embedded lecture documents for faster read performance and virtual fields to compute lecture count dynamically. Validation ensures data integrity, and creator references enable admin traceability.”

---

## 🚀 Future Enhancements

* Separate `Lecture` model (scalability)
* Course ratings & reviews
* Course pricing & discount
* Course progress tracking

---

Agar chaho to main:

* 📁 **Ye README.md proper markdown file bana doon**
* 🔐 **Course authorization middleware**
* 🎥 **Lecture add/delete controllers**

Bas bolo 👍
