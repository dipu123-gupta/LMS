

## 📁 File ka Purpose (High Level)

👉 **AppError ek custom error class hai**
👉 Iska kaam hai:

* Normal JS errors se **better structured errors** banana
* Status code + message ko ek saath handle karna
* Central `errorMiddleware` ke sath clean integration

---

## 🔹 Tumhara Code

```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
```

---

## 🔍 Line-by-Line Explanation

---

### 1️⃣ `class AppError extends Error`

```js
class AppError extends Error {
```

➡️ Ye **JavaScript ka built-in `Error` class extend** kar raha hai
➡️ Matlab:

* Ye bhi error hai
* But **extra features** ke sath

📌 Built-in `Error` sirf ye deta hai:

```js
{
  message,
  stack
}
```

📌 **AppError extra deta hai:**

```js
{
  message,
  statusCode
}
```

---

### 2️⃣ Constructor

```js
constructor(message, statusCode) {
```

➡️ Jab bhi new error banega, ye constructor call hoga
➡️ Tum:

* Error ka message
* HTTP status code
  pass kar sakte ho

📌 Example:

```js
new AppError("User not found", 404);
```

---

### 3️⃣ `super(message)`

```js
super(message);
```

➡️ Parent class (`Error`) ka constructor call hota hai
➡️ Isse:

* `this.message` set hota hai
* `this.stack` create hota hai

❌ Agar `super()` call nahi kiya → error throw ho jayega

---

### 4️⃣ `this.statusCode = statusCode`

```js
this.statusCode = statusCode;
```

➡️ Custom property add ki:

* HTTP status code store karne ke liye

📌 Ye baad me `error.middleware.js` use karega:

```js
res.status(err.statusCode).json({ message: err.message });
```

---

### 5️⃣ `Error.captureStackTrace`

```js
Error.captureStackTrace(this, this.constructor);
```

➡️ Ye **V8 engine ka feature** hai
➡️ Kaam:

* Stack trace ko clean banata hai
* Constructor line ko stack me show nahi karta

📌 Without this:

```
at new AppError (...)
```

📌 With this:

```
at registerController (...)
```

➡️ Debugging easy ho jati hai 🔥

---

## 🔁 Real Use Case (Controller Example)

```js
import AppError from "../utils/AppError.js";

const profile = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("User not authenticated", 401));
  }

  res.status(200).json({
    success: true,
    user: req.user
  });
};
```

➡️ Error direct response nahi bhejta
➡️ `next()` ke through **errorMiddleware** ko pass hota hai

---

## 🔹 error.middleware.js ke sath Relation

Typical error middleware:

```js
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};

export default errorMiddleware;
```

➡️ Yaha `AppError` ka **real power** dikhta hai

---

## 🎯 Interview Me Kaise Explain Kare (One Line)

> **AppError ek custom error class hai jo built-in Error ko extend karke HTTP status codes ke sath structured error handling allow karta hai.**

---

## ✅ Verdict (Production Ready?)

✔ Clean
✔ Industry standard
✔ Debug friendly
✔ Centralized error handling compatible

🔥 **Ye same pattern tumhe almost har professional Node.js backend me milega**

---

