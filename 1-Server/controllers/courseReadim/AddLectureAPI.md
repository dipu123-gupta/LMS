

## 📌 Code (reference)

```js
const AddLectureToCourseById = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;

    if (!title || !description) {
      return next(new AppError("All fields are required", 400));
    }

    const course = await Course.findById(id);
    if (!course) {
      return next(new AppError("Course does not exist", 404));
    }

    const lectureData = {
      title,
      description,
      lecture: {},
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lms/lectures",
      });

      lectureData.lecture = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      await fs.rm(req.file.path);
    }

    course.lectures.push(lectureData);
    course.numberOfLectures = course.lectures.length;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture successfully added",
      course,
    });
  } catch (error) {
    next(error);
  }
};
```

---

# 🔁 STEP-BY-STEP FLOW (LINE BY LINE)

---

## 🟢 STEP 1: Client lecture add request bhejta hai

Example:

```
POST /api/v1/course/:id/lecture
```

Body → `form-data`

```
title       : Introduction to Node.js
description : Basics of Node.js
video       : (mp4 file)
```

➡️ Request **router → middleware (auth, multer)** ke baad
➡️ `AddLectureToCourseById` controller tak aati hai

---

## 🟢 STEP 2: Controller function execute hota hai

```js
(req, res, next) => { ... }
```

* `req.body` → lecture ka text data
* `req.params.id` → course id
* `req.file` → uploaded video (optional)
* `next` → error handling

---

## 🟢 STEP 3: `try` block start hota hai

```js
try {
```

👉 Matlab:

* Is controller ke andar koi bhi error aaya
* Wo `catch` me handle hoga
* Server crash nahi karega

---

## 🟢 STEP 4: Request se lecture data nikala jaata hai

```js
const { title, description } = req.body;
const { id } = req.params;
```

* `title`, `description` → lecture info
* `id` → jis course me lecture add karna hai

---

## 🟢 STEP 5: Validation (lecture fields required)

```js
if (!title || !description) {
  return next(new AppError("All fields are required", 400));
}
```

* Agar title ya description missing:

  * `400 Bad Request`
  * Aage ka code execute nahi hota

---

## 🟢 STEP 6: Course database se fetch hota hai

```js
const course = await Course.findById(id);
```

### Possible cases:

* Course mil gaya → `course` object
* Course nahi mila → `null`

---

## 🟡 STEP 7: Course exist karta hai ya nahi — check

```js
if (!course) {
  return next(new AppError("Course does not exist", 404));
}
```

* Galat / deleted course ID
* `404 Not Found`
* Function yahin ruk jaata hai

---

## 🟢 STEP 8: Lecture ka base object banta hai

```js
const lectureData = {
  title,
  description,
  lecture: {},
};
```

* Lecture ka **text part ready**
* `lecture` object me video info baad me aayega

---

## 🟢 STEP 9: Agar video file aayi ho

```js
if (req.file) {
```

* `multer` ne file ko temporary folder me save kiya
* Path → `req.file.path`

---

### 🔹 STEP 9.1: Video Cloudinary pe upload hota hai

```js
const result = await cloudinary.uploader.upload(req.file.path, {
  folder: "lms/lectures",
});
```

* Video Cloudinary ke `lms/lectures` folder me upload
* Response me milta hai:

  * `public_id`
  * `secure_url`

---

### 🔹 STEP 9.2: Lecture object me video attach hota hai

```js
lectureData.lecture = {
  public_id: result.public_id,
  secure_url: result.secure_url,
};
```

* Ab lecture ke paas apna video link hai

---

### 🔹 STEP 9.3: Local temporary file delete hoti hai

```js
await fs.rm(req.file.path);
```

* Server ka storage clean
* Unnecessary files nahi bachte

---

## 🟢 STEP 10: Lecture course ke andar push hota hai

```js
course.lectures.push(lectureData);
```

* MongoDB sub-document array (`lectures`) me naya lecture add

---

## 🟢 STEP 11: Lecture count update hota hai

```js
course.numberOfLectures = course.lectures.length;
```

* Total lectures ka count maintain hota hai
* Listing / UI ke liye useful

---

## 🟢 STEP 12: Course save hota hai

```js
await course.save();
```

* Poora updated course MongoDB me persist
* Lecture permanently store ho jaata hai

---

## 🟢 STEP 13: Success response client ko bheja jaata hai

```js
res.status(200).json({
  success: true,
  message: "Lecture successfully added",
  course,
});
```

* `200 OK`
* Updated course ke saath response

---

## 🔴 STEP 14: Agar kahin bhi error aaye

```js
catch (error) {
  next(error);
}
```

* Error global error middleware ko jaata hai
* Clean JSON error response milta hai

---

# 🧠 COMPLETE FLOW (ONE LOOK)

```
POST /course/:id/lecture
   ↓
req.body (title, description)
req.file (video)
   ↓
Validate lecture fields
   ↓
Course.findById
   ↓
Course exists?
   ├─ NO → 404 error
   └─ YES
        ↓
   Upload video to Cloudinary
        ↓
   Add lecture to course.lectures
        ↓
   Update numberOfLectures
        ↓
   course.save()
        ↓
   200 Success
```

---

# 🎯 Interview-ready one-liner

> “This controller validates lecture input, uploads lecture media to Cloudinary, embeds the lecture as a subdocument inside the course, updates lecture count, persists changes to MongoDB, and returns a success response with centralized error handling.”
