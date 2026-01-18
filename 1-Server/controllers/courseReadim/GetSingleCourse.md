

## 📌 Code (reference)

```js
const getLectureByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Invalid course id", 400));
    }

    res.status(200).json({
      success: true,
      message: "Lectures fetched successfully",
      lectures: course.lectures,
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
GET /api/v1/course/65ab1234abcd5678ef90
```

* URL ka last part → `:id`
* Ye request router ke through
* `getLectureByCourseId` controller tak aati hai

---

## 🟢 STEP 2: Controller function execute hota hai

```js
(req, res, next) => { ... }
```

* `req` → request ka data
* `res` → response bhejne ke liye
* `next` → error handling ke liye

---

## 🟢 STEP 3: `try` block start hota hai

```js
try {
```

👉 Matlab:

* Jo bhi error aayega
* `catch` block me handle hoga
* Server crash nahi karega

---

## 🟢 STEP 4: URL se course `id` nikali jaati hai

```js
const { id } = req.params;
```

### Yahan kya hota hai?

* `req.params` = `{ id: "65ab1234abcd5678ef90" }`
* `id` variable me course ki MongoDB `_id` aa jaati hai

---

## 🟢 STEP 5: Database se course find hota hai

```js
const course = await Course.findById(id);
```

### Is line ka matlab:

* MongoDB ko bolo:

  > “Is `id` ka course de do”
* `await` → DB response ka wait
* Result:

  * Course mil jaata hai → object
  * Course nahi milta → `null`

---

## 🟡 STEP 6: Course exist karta hai ya nahi — check

```js
if (!course) {
  return next(new AppError("Invalid course id", 400));
}
```

### Agar course **nahi mila**:

* `course === null`
* Client ne galat / non-existing `id` bheji
* Error middleware ko bhej dete hain:

  * Message: `"Invalid course id"`
  * Status: `400 Bad Request`
* `return` → aage ka code execute nahi hota

---

## 🟢 STEP 7: Course mil gaya → lectures bhejo

```js
res.status(200).json({
  success: true,
  message: "Lectures fetched successfully",
  lectures: course.lectures,
});
```

### Yahan kya ho raha hai?

* `course.lectures`

  * Ye **lectures array** hota hai
  * Jo course schema ke andar defined hai
* Client ko JSON response milta hai

Example response:

```json
{
  "success": true,
  "message": "Lectures fetched successfully",
  "lectures": [
    {
      "title": "Intro",
      "description": "Basics",
      "lecture": {
        "secure_url": "cloudinary-link"
      }
    }
  ]
}
```

---

## 🔴 STEP 8: Agar koi unexpected error aata hai

Jaise:

* MongoDB error
* Invalid ObjectId format
* Network issue

Flow `catch` me jaata hai 👇

```js
catch (error) {
  return next(new AppError(error.message, 500));
}
```

### Matlab:

* Actual error message lo
* `500 Internal Server Error`
* Global error middleware handle karega

---

# 🧠 COMPLETE FLOW IN ONE LOOK

```
Client Request
   ↓
req.params.id
   ↓
Course.findById(id)
   ↓
Course found?
   ├─ NO → 400 Invalid course id
   └─ YES
        ↓
   course.lectures
        ↓
   200 Success Response
```

---

# 🎯 Interview-ready explanation (short)

> “This controller extracts the course ID from the request URL, fetches the corresponding course from MongoDB, validates its existence, and returns the embedded lectures array. Any error is delegated to centralized error handling.”

---


