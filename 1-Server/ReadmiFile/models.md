
---

# 📁 User Model – High Level Overview

👉 Ye file define karti hai:

* User ka **structure (schema)**
* Password **hashing**
* JWT **token generation**
* Forgot password **secure flow**
* Password **comparison**

---

## 1️⃣ Imports ka kaam

```js
import mongoose from "mongoose";
```

➡️ MongoDB ke sath kaam karne ke liye
➡️ Schema + Model banane ke kaam aata hai

---

```js
import bcrypt from "bcryptjs";
```

➡️ Password hashing ke liye
➡️ Plain password ko encrypted form me store karta hai

---

```js
import jwt from "jsonwebtoken";
```

➡️ JWT token generate karne ke liye
➡️ Login ke baad authentication ke kaam aata hai

---

```js
import crypto from "crypto"; // ✅ IMPORTANT
```

➡️ Node.js ka built-in module
➡️ Secure random token generate karne ke liye
➡️ **Forgot password system ka core**

---

## 2️⃣ User Schema Definition

```js
const userSchema = new mongoose.Schema(
```

➡️ User ka structure define hota hai

---

### 🔹 Name Field

```js
name: { 
  type: String, 
  required: true, 
  trim: true 
},
```

➡️ User ka naam
➡️ `trim:true` → extra spaces remove kar deta hai
➡️ Required field hai

---

### 🔹 Email Field

```js
email: { 
  type: String, 
  required: true, 
  unique: true 
},
```

➡️ Email unique hoga
➡️ Duplicate email se user create nahi hoga

📌 **Best practice**: Email lowercase karna controller me

---

### 🔹 Password Field

```js
password: { 
  type: String, 
  required: true, 
  select: false 
},
```

🔥 **MOST IMPORTANT LINE**

➡️ `select:false` ka matlab:

* DB se data fetch karte waqt password **by default nahi aayega**
* Security ke liye mandatory

📌 Agar password chahiye:

```js
User.findOne({ email }).select("+password");
```

---

### 🔹 Avatar (Profile Image)

```js
avatar: {
  public_id: String,
  secure_url: String,
},
```

➡️ Cloudinary ke liye structure
➡️ `public_id` → image delete/update ke kaam aata hai
➡️ `secure_url` → frontend pe image show karne ke liye

---

### 🔹 Role

```js
role: { type: String, default: "user" },
```

➡️ Authorization ke liye
➡️ Future me:

* admin
* moderator
  add kar sakte ho

---

### 🔹 Forgot Password Fields

```js
forgetPasswordToken: String,
forgetPasswordExpiry: Date,
```

➡️ Password reset ke liye token store hota hai
➡️ Expiry time ke baad token invalid ho jata hai

---

### 🔹 Timestamps

```js
{ timestamps: true }
```

➡️ Automatically ye fields add hote hain:

```js
createdAt
updatedAt
```

---

## 3️⃣ Pre Save Hook (Password Hashing)

```js
userSchema.pre("save", async function () {
```

➡️ Ye function **DB me save hone se pehle** chalta hai

---

```js
if (!this.isModified("password")) return;
```

🔥 **VERY IMPORTANT**

➡️ Agar password change nahi hua:

* dobara hash nahi karega
  ➡️ Profile update ke time password safe rahega

---

```js
this.password = await bcrypt.hash(this.password, 10);
```

➡️ Password hash ho raha hai
➡️ `10` = salt rounds
➡️ Industry standard value

---

## 4️⃣ Forgot Password Token Generator

```js
userSchema.methods.generatePasswordResetToken = function () {
```

➡️ Ye **instance method** hai
➡️ Har user ke liye alag kaam karega

---

### 🔹 Random Token

```js
const resetToken = crypto.randomBytes(32).toString("hex");
```

➡️ Secure random token generate
➡️ Ye token **email me bheja jata hai**

---

### 🔹 Hashed Token Store

```js
this.forgetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");
```

🔥 **Security Reason**

➡️ DB me **plain token store nahi hota**
➡️ Agar DB leak ho jaye → token safe rahega

---

### 🔹 Token Expiry

```js
this.forgetPasswordExpiry = Date.now() + 15 * 60 * 1000;
```

➡️ Token sirf **15 minutes** ke liye valid
➡️ Time ke baad automatically invalid

---

```js
return resetToken;
```

➡️ Plain token return hota hai
➡️ Email me send karte ho

---

## 5️⃣ JWT Token Generator

```js
userSchema.methods.generateToken = function () {
```

➡️ Login ke baad call hota hai

---

```js
return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
  expiresIn: process.env.JWT_EXPIRE,
});
```

➡️ Payload me user ID
➡️ Secret key se sign
➡️ Expiry env file se control

📌 `.env`

```env
SECRET_KEY=jwtsecret
JWT_EXPIRE=7d
```

---

## 6️⃣ Password Compare Method

```js
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
```

➡️ Login ke time:

* Plain password
* Hashed password
  compare karta hai

➡️ Return:

* `true` → password match
* `false` → wrong password

---

## 7️⃣ Model Export

```js
export default mongoose.model("User", userSchema);
```

➡️ User model create ho gaya
➡️ Controllers me use kar sakte ho

---

## 🎯 Interview One-Liner

> **User schema authentication, authorization, password hashing, JWT token generation aur secure forgot password flow ko handle karta hai.**

---

## ✅ FINAL VERDICT (PRODUCTION READY)

✔ Secure password handling
✔ JWT based authentication
✔ Proper forgot password system
✔ Industry-level structure

🔥 **Ye model tum directly real-world project me use kar sakte ho**


