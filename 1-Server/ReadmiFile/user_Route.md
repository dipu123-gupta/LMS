
---

## 1️⃣ Imports ka kaam

```js
import express from "express";
```

➡️ **Express framework** import ho raha hai jisse hum routes bana sake.

---

```js
import {
  register,
  login,
  profile,
  logout,
  forgetPassword,
  resetPassword,
  changePassword,
  updateProfile
} from "../controllers/user.controller.js";
```

➡️ Ye **controller functions** hain
➡️ Har function ek specific kaam karta hai:

| Function         | Kaam                              |
| ---------------- | --------------------------------- |
| `register`       | New user create karta hai         |
| `login`          | User ko login karta hai           |
| `profile`        | Logged-in user ka data deta hai   |
| `logout`         | User ko logout karta hai          |
| `forgetPassword` | Reset password email bhejta hai   |
| `resetPassword`  | Token ke through password reset   |
| `changePassword` | Logged-in user ka password change |
| `updateProfile`  | User ka profile update            |

---

```js
import upload from "../middlewares/multer.middleware.js";
```

➡️ **Multer middleware**
➡️ File upload ke liye use hota hai
➡️ Yaha avatar (profile image) upload ho rahi hai

---

```js
import isLoginedIn from "../middlewares/auth.middleware.js";
```

➡️ **Authentication middleware**
➡️ Check karta hai:

* User login hai ya nahi
* Token valid hai ya nahi

---

## 2️⃣ Router create karna

```js
const authRouter = express.Router();
```

➡️ Express ka **Router object**
➡️ Isse routes modular & clean bante hain

---

## 3️⃣ Routes Explanation (MOST IMPORTANT)

---

### 🔹 REGISTER ROUTE

```js
authRouter.post("/register", upload.single("avatar"), register);
```

**Flow 👇**

1. User form data bhejta hai
2. `upload.single("avatar")`

   * Avatar image upload hoti hai
   * `req.file` me milti hai
3. `register` controller call hota hai

📌 **Postman / Frontend**

```text
Content-Type: multipart/form-data
avatar: image file
name, email, password
```

---

### 🔹 LOGIN ROUTE

```js
authRouter.post("/login", login);
```

➡️ Simple login route
➡️ Body me:

```json
{
  "email": "test@gmail.com",
  "password": "123456"
}
```

---

### 🔹 PROFILE ROUTE (Protected)

```js
authRouter.get("/profile", isLoginedIn, profile);
```

**Flow 👇**

1. `isLoginedIn`

   * Token verify karta hai
   * `req.user` attach karta hai
2. `profile` controller user ka data bhejta hai

❌ Login bina token → **Access denied**

---

### 🔹 LOGOUT ROUTE

```js
authRouter.get("/logout", isLoginedIn, logout);
```

➡️ Token / cookie clear karta hai
➡️ User logout ho jata hai

---

## 4️⃣ PASSWORD RESET SYSTEM

---

### 🔹 FORGOT PASSWORD

```js
authRouter.post("/forgotpassword", forgetPassword);
```

➡️ User sirf email bhejta hai
➡️ Backend:

* Reset token generate karta hai
* Email bhejta hai (link ke sath)

📌 Example:

```json
{
  "email": "test@gmail.com"
}
```

---

### 🔹 RESET PASSWORD (TOKEN BASED)

```js
authRouter.post("/reset-password/:resetToken", resetPassword);
```

➡️ URL se token aata hai
➡️ New password body me

📌 Example:

```json
{
  "password": "newpassword123"
}
```

➡️ Ye route **login ke bina** kaam karta hai

---

### 🔹 CHANGE PASSWORD (LOGGED IN)

```js
authRouter.post("/change-password", isLoginedIn, changePassword);
```

➡️ Login hona compulsory
➡️ Old password + new password check hota hai

📌 Example:

```json
{
  "oldPassword": "123456",
  "newPassword": "new123456"
}
```

---

## 5️⃣ UPDATE PROFILE

```js
authRouter.put(
  "/update",
  upload.single("avatar"),
  isLoginedIn,
  updateProfile
);
```

### ⚠️ IMPORTANT NOTE (ORDER ISSUE)

❌ **Tumne order galat rakha hai**

### ❌ Current Order

```js
upload.single("avatar"),
isLoginedIn,
```

### ✅ Best Practice (SECURITY)

```js
isLoginedIn,
upload.single("avatar"),
updateProfile
```

### ✅ Correct Code

```js
authRouter.put(
  "/update",
  isLoginedIn,
  upload.single("avatar"),
  updateProfile
);
```

➡️ Pehle check hona chahiye user login hai
➡️ Warna koi bhi image upload kar sakta hai (security risk)

---

## 6️⃣ Export Router

```js
export default authRouter;
```

➡️ Is router ko `app.js` me use karoge:

```js
app.use("/api/v1/auth", authRouter);
```

---

## ✅ FINAL VERDICT

✔ Structure **bilkul sahi**
✔ Routes professional project jaise
✔ Forgot/Reset password system correct
⚠️ **Bas update route me middleware order fix karo**

---


