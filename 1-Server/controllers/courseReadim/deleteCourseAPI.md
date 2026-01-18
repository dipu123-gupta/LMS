
---

## 📌 Code (reference)

```js
const removeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    if (course.thumbnail.public_id) {
      await cloudinary.uploader.destroy(course.thumbnail.public_id);
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
```

---

# 🔁 STEP-BY-STEP FLOW (LINE BY LINE)

---

## 🟢 STEP 1: Client delete request bhejta hai

Example:

```
DELETE /api/v1/course/65ab1234abcd5678ef90
```

* URL me jo `:id` hai
* Wo course ka MongoDB `_id` hota hai
* Request router ke through `removeCourse` controller tak aati hai

---

## 🟢 STEP 2: Controller function execute hota hai

```js
(req, res, next) => { ... }
```

* `req` → request data
* `res` → response bhejna
* `next` → error middleware ke liye

---

## 🟢 STEP 3: `try` block start hota hai

```js
try {
```

👉 Matlab:

* Is block ke andar koi error aaya
* To `catch` block me handle hoga
* Server crash nahi karega

---

## 🟢 STEP 4: URL se course ID nikali jaati hai

```js
const { id } = req.params;
```

* `req.params.id` = jis course ko delete karna hai uski ID

---

## 🟢 STEP 5: Database se course find hota hai

```js
const course = await Course.findById(id);
```

### Yahan kya hota hai?

* Agar course exist karta hai → object milta hai
* Agar course exist nahi karta → `null` milta hai

---

## 🟡 STEP 6: Course mila ya nahi — check

```js
if (!course) {
  return next(new AppError("Course not found", 404));
}
```

* Agar course nahi mila
* To client ne galat / already deleted ID bheji
* `404 Not Found` error return
* Aage ka code **execute nahi hota**

---

## 🟢 STEP 7: Course ki thumbnail image delete hoti hai

```js
if (course.thumbnail.public_id) {
  await cloudinary.uploader.destroy(course.thumbnail.public_id);
}
```

### Yahan kya ho raha hai?

* Agar course ke paas thumbnail image hai
* To pehle Cloudinary se wo image delete kar dete hain

👉 **Kyun?**

* Cloud storage clean rahe
* Orphan (unused) images na bache

---

## 🟢 STEP 8: Course MongoDB se delete hota hai

```js
await Course.findByIdAndDelete(id);
```

* Ab actual course document database se remove ho jaata hai
* Ye **permanent delete** hai

---

## 🟢 STEP 9: Success response client ko bheja jaata hai

```js
res.status(200).json({
  success: true,
  message: "Course deleted successfully",
});
```

* `200 OK` status
* Client ko confirmation mil jaata hai

---

## 🔴 STEP 10: Agar koi unexpected error aaye

```js
catch (error) {
  return next(new AppError(error.message, 500));
}
```

* Jaise:

  * DB connection error
  * Cloudinary error
* To:

  * `500 Internal Server Error`
  * Global error middleware handle karega

---

# 🧠 COMPLETE FLOW (ONE LOOK)

```
DELETE Request
   ↓
req.params.id
   ↓
Course.findById
   ↓
Course exists?
   ├─ NO → 404 Course not found
   └─ YES
        ↓
   Delete thumbnail from Cloudinary
        ↓
   Delete course from MongoDB
        ↓
   200 Success response
```

---

# 🎯 Interview-ready one-liner

> “This controller safely deletes a course by first validating its existence, removing the associated thumbnail from Cloudinary to prevent unused assets, deleting the course document from MongoDB, and returning a success response with proper error handling.”
