

## 📌 Code (reference)

```js
const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
      return next(new AppError("All fields are required", 400));
    }

    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      thumbnail: {
        public_id: "dummy",
        secure_url: "dummy",
      },
    });

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lms",
      });

      course.thumbnail = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      await fs.rm(req.file.path);
    }

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
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

## 🟢 STEP 1: Client request bhejta hai

Example (Postman / Frontend):

```
POST /api/v1/course
```

Body → `form-data`

```
title       : Node.js Complete Course
description : Learn Node.js
category    : Programming
createdBy   : admin
thumbnail   : (file)
```

Request **router → middleware → is controller** tak aati hai.

---

## 🟢 STEP 2: Controller function execute hota hai

```js
(req, res, next) => { ... }
```

* `req` → request ka data (body, file, params)
* `res` → response bhejne ke liye
* `next` → error middleware ke liye

---

## 🟢 STEP 3: `try` block start hota hai

```js
try {
```

👉 Iska matlab:

* Controller ke andar agar **koi error** aaya
* To wo `catch` block me handle hoga
* Server crash nahi karega

---

## 🟢 STEP 4: Request body se text data nikala jaata hai

```js
const { title, description, category, createdBy } = req.body;
```

* Ye saare **text fields** hain
* `form-data` me jo text hota hai wo **`req.body` me aata hai**

---

## 🟢 STEP 5: Validation (sab fields aaye ya nahi)

```js
if (!title || !description || !category || !createdBy) {
  return next(new AppError("All fields are required", 400));
}
```

### Yahan kya ho raha hai?

* Check:

  * koi field missing to nahi?
* Agar missing:

  * Error create hota hai
  * Status: `400 Bad Request`
  * `return` → aage ka code **ruk jaata hai**

---

## 🟢 STEP 6: Course ka basic record DB me create hota hai

```js
const course = await Course.create({
  title,
  description,
  category,
  createdBy,
  thumbnail: {
    public_id: "dummy",
    secure_url: "dummy",
  },
});
```

### Important point:

* Pehle **course create** hota hai
* Thumbnail ke liye **temporary dummy value**
* Kyunki:

  * Cloudinary upload async hota hai
  * Course ko pehle DB me banana safe hota hai

---

## 🟢 STEP 7: Agar thumbnail file aayi ho

```js
if (req.file) {
```

* `multer` ne file ko process karke
* `req.file` me daal diya

---

### 🔹 STEP 7.1: Cloudinary upload

```js
const result = await cloudinary.uploader.upload(req.file.path, {
  folder: "lms",
});
```

* Local file Cloudinary pe upload hoti hai
* Response me milta hai:

  * `public_id`
  * `secure_url`

---

### 🔹 STEP 7.2: Course thumbnail update

```js
course.thumbnail = {
  public_id: result.public_id,
  secure_url: result.secure_url,
};
```

* Dummy thumbnail replace ho jaata hai
* Ab course ke paas real image URL hota hai

---

### 🔹 STEP 7.3: Local file delete

```js
await fs.rm(req.file.path);
```

* Server pe jo temporary file bani thi
* Wo delete ho jaati hai
* Storage clean rehta hai

---

## 🟢 STEP 8: Updated course save hota hai

```js
await course.save();
```

* Thumbnail update ke baad
* MongoDB me final data save

---

## 🟢 STEP 9: Success response client ko bheja jaata hai

```js
res.status(201).json({
  success: true,
  message: "Course created successfully",
  course,
});
```

* `201 Created` → naya resource bana
* Client ko poora course object mil jaata hai

---

## 🔴 STEP 10: Agar kahin bhi error aaye

```js
catch (error) {
  next(error);
}
```

* Error global error middleware ko chala jaata hai
* Proper JSON error response milta hai

---

# 🧠 FLOW SUMMARY (ONE GLANCE)

```
POST Request
   ↓
req.body (text)
req.file (thumbnail)
   ↓
Validation
   ↓
Course.create (dummy thumbnail)
   ↓
Cloudinary upload
   ↓
Thumbnail update
   ↓
course.save()
   ↓
201 Success response
```

---

# 🎯 Interview-ready one-liner

> “This controller validates input, creates a course record, uploads the thumbnail to Cloudinary, updates the course with the uploaded image, cleans up local files, and returns a created response with proper error handling.”

---

