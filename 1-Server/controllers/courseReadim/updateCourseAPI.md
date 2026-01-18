

## 📌 Code (reference)

```js
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Course with given id does not exist", 404));
    }

    const { title, description, category } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;

    if (req.file) {
      // delete old thumbnail
      if (course.thumbnail.public_id) {
        await cloudinary.uploader.destroy(course.thumbnail.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lms",
      });

      course.thumbnail = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      fs.rmSync(req.file.path);
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
```

---

# 🔁 STEP-BY-STEP FLOW (LINE BY LINE)

---

## 🟢 STEP 1: Client request bhejta hai

Example:

```
PUT /api/v1/course/65ab1234abcd5678ef90
```

Body → `form-data / JSON`

```
title       : Updated Node.js Course
category    : Backend
thumbnail   : (new image file)  // optional
```

➡️ Request router → middleware → `updateCourse` controller me aati hai.

---

## 🟢 STEP 2: Controller function call hota hai

```js
(req, res, next) => { ... }
```

* `req` → request data
* `res` → response bhejne ke liye
* `next` → error handling

---

## 🟢 STEP 3: `try` block start

```js
try {
```

👉 Iska matlab:

* Controller ke andar koi bhi error aayega
* Wo `catch` me handle hoga
* App crash nahi karegi

---

## 🟢 STEP 4: URL se course ID nikali jaati hai

```js
const { id } = req.params;
```

* `req.params.id` = MongoDB course `_id`

---

## 🟢 STEP 5: Database se course find hota hai

```js
const course = await Course.findById(id);
```

### Possible results:

* Course mil gaya → `course` object
* Course nahi mila → `null`

---

## 🟡 STEP 6: Course exist karta hai ya nahi — check

```js
if (!course) {
  return next(new AppError("Course with given id does not exist", 404));
}
```

* Agar `course === null`
* Client ne galat / deleted id bheji
* `404 Not Found`
* Function yahin **return** ho jaata hai

---

## 🟢 STEP 7: Request body se update fields nikalo

```js
const { title, description, category } = req.body;
```

* Ye sab **optional fields** hain
* Jo bheje gaye honge wahi update honge

---

## 🟢 STEP 8: Field-by-field update (partial update)

```js
if (title) course.title = title;
if (description) course.description = description;
if (category) course.category = category;
```

👉 Matlab:

* Agar sirf `title` bheja → sirf title update
* Baaki fields unchanged rahengi
  (Ye **PATCH-like behavior** hai)

---

## 🟢 STEP 9: Agar naya thumbnail aaya ho

```js
if (req.file) {
```

* `multer` ne file ko `req.file` me diya

---

### 🔹 STEP 9.1: Old thumbnail delete

```js
if (course.thumbnail.public_id) {
  await cloudinary.uploader.destroy(course.thumbnail.public_id);
}
```

* Purani image Cloudinary se delete
* Storage clean + duplicate avoid

---

### 🔹 STEP 9.2: New thumbnail upload

```js
const result = await cloudinary.uploader.upload(req.file.path, {
  folder: "lms",
});
```

* Nayi image Cloudinary pe upload
* Response me `public_id`, `secure_url`

---

### 🔹 STEP 9.3: Course thumbnail update

```js
course.thumbnail = {
  public_id: result.public_id,
  secure_url: result.secure_url,
};
```

* Course document me new image save

---

### 🔹 STEP 9.4: Local file delete

```js
fs.rmSync(req.file.path);
```

* Server se temporary file hata di
* Disk space clean

---

## 🟢 STEP 10: Updated course save hota hai

```js
await course.save();
```

* MongoDB me final updated data save

---

## 🟢 STEP 11: Success response client ko

```js
res.status(200).json({
  success: true,
  message: "Course updated successfully",
  course,
});
```

* `200 OK`
* Updated course object return

---

## 🔴 STEP 12: Agar koi error aaye

```js
catch (error) {
  return next(new AppError(error.message, 500));
}
```

* Error global error middleware ko chala jaata hai
* Client ko proper error JSON milta hai

---

# 🧠 FLOW SUMMARY (ONE LOOK)

```
PUT Request
   ↓
req.params.id
   ↓
Course.findById
   ↓
Course exists?
   ├─ NO → 404 error
   └─ YES
        ↓
   Update fields (title/desc/category)
        ↓
   If new thumbnail:
        - delete old
        - upload new
        - update thumbnail
        - delete local file
        ↓
   course.save()
        ↓
   200 Success
```

---

# 🎯 Interview-ready one-liner

> “This controller performs a partial update on a course, safely replaces the thumbnail in Cloudinary when provided, persists changes to MongoDB, and returns the updated resource with centralized error handling.”

---

