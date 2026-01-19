

## 📁 Middleware ka Role (High Level)

👉 **isLoginedIn middleware** ka kaam hai:

* Check karna ki user **login hai ya nahi**
* JWT token **verify** karna
* Verified user ko `req.user` me attach karna
* Protected routes ko secure banana

---

## 🔹 Tumhara Code

```js
import jwt from "jsonwebtoken";
import AppError from "../utils/error.util.js";

const isLoginedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new AppError("Unauthenticated, please login again", 400)
    );
  }

  const payloads = await jwt.verify(
    token,
    process.env.SECRET_KEY
  );

  req.user = payloads;
  next();
};
export default isLoginedIn;
```

---

## 🔍 Line-by-Line Explanation

---

### 1️⃣ JWT Import

```js
import jwt from "jsonwebtoken";
```

➡️ JWT token verify karne ke liye
➡️ Ye token login ke time generate hota hai

---

### 2️⃣ Custom Error Import

```js
import AppError from "../utils/error.util.js";
```

➡️ Tumhari **custom AppError class**
➡️ Structured error handling ke liye

---

### 3️⃣ Middleware Function

```js
const isLoginedIn = async (req, res, next) => {
```

➡️ Ye ek **Express middleware** hai
➡️ 3 parameters:

* `req`
* `res`
* `next`

---

### 4️⃣ Token Extract karna (Cookies se)

```js
const { token } = req.cookies;
```

➡️ Cookie-based authentication
➡️ Login ke time token cookie me store hota hai

📌 Example Cookie:

```
token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 5️⃣ Token Missing Check

```js
if (!token) {
  return next(
    new AppError("Unauthenticated, please login again", 400)
  );
}
```

➡️ Agar token nahi mila:

* User login nahi hai
* Error middleware ko control de do

⚠️ **Status Code Issue**

❌ `400` (Bad Request)
✅ **Correct:** `401` (Unauthorized)

---

### 6️⃣ Token Verify

```js
const payloads = await jwt.verify(
  token,
  process.env.SECRET_KEY
);
```

➡️ JWT verify hota hai
➡️ Agar token:

* Expired
* Invalid
* Tampered

➡️ `jsonwebtoken` **error throw** karega

📌 Payload example:

```js
{
  id: "64bdf...",
  iat: 1700000000,
  exp: 1700600000
}
```

---

### 7️⃣ User Attach karna

```js
req.user = payloads;
```

➡️ Verified user data `req.user` me store
➡️ Controllers use kar sakte hain

📌 Example:

```js
req.user.id
```

---

### 8️⃣ Next Middleware

```js
next();
```

➡️ Control next middleware / controller ko milta hai

---

## ❌ Missing Error Handling (IMPORTANT BUG)

Agar token invalid ho:

```js
jwt.verify()
```

➡️ Error throw karega
➡️ App crash ho sakta hai ❌

---

## ✅ Production-Ready Version (FIXED)

```js
import jwt from "jsonwebtoken";
import AppError from "../utils/error.util.js";

const isLoginedIn = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new AppError("Unauthenticated, please login again", 401)
    );
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.SECRET_KEY
    );

    req.user = payload;
    next();
  } catch (error) {
    return next(
      new AppError("Invalid or expired token", 401)
    );
  }
};

export default isLoginedIn;
```

---

## 🔐 Security Improvement (RECOMMENDED)

### 1️⃣ Only ID store karo

JWT payload me sirf:

```js
{ id: this._id }
```

➡️ Tum already ye kar rahe ho ✅

---

### 2️⃣ DB se fresh user fetch karo (BEST PRACTICE)

```js
const user = await User.findById(payload.id);
if (!user) {
  return next(new AppError("User no longer exists", 401));
}
req.user = user;
```

➡️ Deleted user ka access block ho jata hai

---

## 🎯 Interview One-Liner

> **isLoginedIn ek JWT based authentication middleware hai jo cookies se token verify karke protected routes ko secure karta hai.**

---

## ✅ FINAL VERDICT

✔ Concept sahi
✔ Cookie-based auth
❌ Status code + try-catch missing
🔥 Fix ke baad **production ready**

---
