

## 📁 errorMiddleware ka Role (High Level)

👉 **Central error handler**
👉 Pure app ke saare errors:

* Controllers se
* Middlewares se
* JWT / Mongo / Multer se
  yahi aakar handle hote hain

➡️ Isse:

* Code clean rehta hai
* Har jagah `try-catch` likhne ki zarurat nahi hoti

---

## 🔹 Tumhara Code

```js
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Something went wrong!";

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack:
      process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorMiddleware;
```

---

## 🔍 Line-by-Line Explanation

---

### 1️⃣ Error Middleware Signature

```js
(err, req, res, next)
```

➡️ Express automatically samajh jata hai ki ye **error handling middleware** hai
➡️ Sirf tab call hota hai jab:

* `next(error)` use kiya jaye
* koi exception throw ho

---

### 2️⃣ Default Status Code

```js
err.statusCode = err.statusCode || 500;
```

➡️ Agar custom error (`AppError`) ne status code diya hai → use karo
➡️ Nahi to:

* `500` → Internal Server Error

---

### 3️⃣ Default Message

```js
err.message = err.message || "Something went wrong!";
```

➡️ Agar error message missing ho → fallback message

---

### 4️⃣ Response JSON

```js
return res.status(err.statusCode).json({
  success: false,
  message: err.message,
```

➡️ Consistent error response structure
➡️ Frontend ke liye easy handling

---

### 5️⃣ Stack Trace (Environment Based)

```js
stack:
  process.env.NODE_ENV === "development" ? err.stack : undefined,
```

🔥 **VERY IMPORTANT SECURITY FEATURE**

➡️ Development me:

* Full error stack dikhega (debugging easy)

➡️ Production me:

* Stack hide ho jata hai
* Internal logic expose nahi hota

---

## 🧪 Example Flow (Real Life)

### Controller me:

```js
return next(new AppError("User not found", 404));
```

### errorMiddleware response:

```json
{
  "success": false,
  "message": "User not found"
}
```

---

## ❗ Limitations (IMPORTANT TO KNOW)

Tumhara middleware **basic level pe perfect hai**, lekin:

* MongoDB errors
* JWT errors
* Duplicate key errors
  ko properly map nahi karta

---

## ✅ PRODUCTION-GRADE VERSION (RECOMMENDED)

```js
import AppError from "../utils/error.util.js";

const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Default
  error.statusCode = err.statusCode || 500;

  // MongoDB invalid ID
  if (err.name === "CastError") {
    error = new AppError("Resource not found", 404);
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    error = new AppError("Duplicate field value entered", 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token, please login again", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new AppError("Token expired, please login again", 401);
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    stack:
      process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorMiddleware;
```

---

## 🎯 Interview One-Liner

> **errorMiddleware ek centralized Express error handler hai jo custom AppError, JWT aur database errors ko environment-based secure response me convert karta hai.**

---

## ✅ FINAL VERDICT

✔ Tumhara current code **bilkul sahi aur clean** hai
✔ Development & production behavior correct
🔥 Enhanced version use karoge to **industry-level backend** ban jayega

---

