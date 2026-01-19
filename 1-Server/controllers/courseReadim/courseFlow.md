

# 🔁 Overall Flow (High Level)

```
CLIENT (Postman / Frontend)
        ↓
ROUTES (course.route.js)
        ↓
MIDDLEWARES
  - isLoggedIn
  - authorizedRole
  - multer (file)
        ↓
CONTROLLERS (course.controller.js)
        ↓
MODEL (Course – MongoDB)
        ↓
RESPONSE
```

---

# 🧩 Controller-wise Flow (DETAIL)

---

## 1️⃣ `getAllCourse` – GET all courses

### 📌 Route

```
GET /api/v1/course
```

### 🔁 Flow

1. Client request bhejta hai
2. Controller MongoDB se:

   ```js
   Course.find({}).select("-lectures")
   ```

   * sab courses milte hain
   * lectures field exclude hota hai (performance)
3. JSON response return

### ✅ Output

```json
{
  "success": true,
  "courses": [...]
}
```

---

## 2️⃣ `getLectureByCourseId` – GET lectures of one course

### 📌 Route

```
GET /api/v1/course/:id
```

### 🔁 Flow

1. URL se `id` milta hai
2. Course find hota hai:

   ```js
   Course.findById(id)
   ```
3. Agar course nahi → error
4. Agar mila → `course.lectures` return

---

## 3️⃣ `createCourse` – CREATE new course (Admin)

### 📌 Route

```
POST /api/v1/course
```

### 🔐 Middlewares

* `isLoggedIn`
* `authorizedRole("admin")`
* `multer.single("thumbnail")`

---

### 🔁 Flow (IMPORTANT)

1. Postman se **form-data** aata hai

   * text → `req.body`
   * file → `req.file`
2. Validation hoti hai:

   ```js
   title, description, category, createdBy
   ```
3. MongoDB me **dummy thumbnail** ke saath course create hota hai
4. Agar file aayi:

   * Cloudinary upload
   * `course.thumbnail` update
   * local file delete
5. Course save hota hai
6. Success response

---

## 4️⃣ `updateCourse` – UPDATE course

### 📌 Route

```
PUT /api/v1/course/:id
```

### 🔁 Flow

1. Course find by id
2. Jo fields aaye wahi update
3. Agar new thumbnail:

   * old delete
   * new upload
4. Save + response

---

## 5️⃣ `removeCourse` – DELETE course

### 📌 Route

```
DELETE /api/v1/course/:id
```

### 🔁 Flow

1. Course find
2. Cloudinary se thumbnail delete
3. MongoDB se course delete
4. Success response

---

## 6️⃣ `AddLectureToCourseById` – ADD lecture (MOST IMPORTANT)

### 📌 Route

```
POST /api/v1/course/:id/lecture
```

### 🔐 Middlewares

* `isLoggedIn`
* `authorizedRole("admin")`
* `multer.single("video")`

---

### 🔁 Flow (Step by Step)

1. Postman se data aata hai

   * `title`, `description` → `req.body`
   * `video` → `req.file`
2. Course find hota hai
3. Lecture object banta hai:

   ```js
   {
     title,
     description,
     lecture: {}
   }
   ```
4. Agar video hai:

   * Cloudinary upload
   * `lecture.lecture.secure_url` set
5. Lecture push hota hai:

   ```js
   course.lectures.push(lectureData)
   ```
6. `numberOfLectures` update
7. `course.save()`
8. Success response

---

# 🧠 Important Concepts Tumne Use Kiye

✔ `req.body` vs `req.file`
✔ JWT auth + role based access
✔ Cloudinary file handling
✔ MongoDB subdocuments (lectures)
✔ Clean error handling

---

# 🗺️ Visual Flow (Lecture Add Example)

```
POSTMAN
  ↓
/course/:id/lecture
  ↓
isLoggedIn → token verify
  ↓
authorizedRole("admin")
  ↓
multer → file → req.file
  ↓
controller
  ↓
Course.findById
  ↓
lectures.push()
  ↓
course.save()
  ↓
RESPONSE
```

---

# ✅ Interview-ready one-liner

> “This flow uses Express routes protected by JWT and role-based middleware, handles multipart form data with Multer, uploads media to Cloudinary, stores structured subdocuments in MongoDB, and returns clean REST responses.”
