

# 🧩 OVERALL BACKEND FILE STRUCTURE (LMS / Auth Project)

```txt
Server/
│
├── app.js
├── server.js
│
├── config/
│   ├── dbConnection.js
│   ├── cloudinary.js
│   └── sendEmail.js
│
├── controllers/
│   └── user.controller.js
│
├── models/
│   └── user.models.js
│
├── routes/
│   └── user.routes.js
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── multer.middleware.js
│   └── error.middleware.js
│
├── utils/
│   └── error.util.js
│
├── uploads/
│
└── .env
```

---

# 🔁 HIGH LEVEL REQUEST FLOW (Bird Eye View)

```
Client (React / Postman)
   ↓
Routes
   ↓
Middleware (auth / multer)
   ↓
Controller
   ↓
Model (MongoDB)
   ↓
Utils / Config (Email, Cloudinary)
   ↓
Response
```

---

# 🔹 server.js (ENTRY POINT)

```js
import app from "./app.js";

app.listen(PORT, () => {
  console.log("Server running");
});
```

👉 **Sirf server start karta hai**
👉 Yahan koi logic nahi hota

---

# 🔹 app.js (APP CONFIGURATION)

```js
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);

app.use(errorMiddleware);
```

### app.js ka role

✔ Middlewares register
✔ Routes connect
✔ Global error handler attach

---

# 🔹 routes/user.routes.js (ROUTING LAYER)

```js
router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.get("/me", isLoggedIn, profile);
router.post("/logout", logout);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.post("/change-password", isLoggedIn, changePassword);
router.put("/update-profile", isLoggedIn, upload.single("avatar"), updateProfile);
```

### Route ka kaam

✔ URL define karna
✔ Kaun sa middleware lagega
✔ Kaun sa controller chalega

❌ **Business logic nahi hota**

---

# 🔹 middlewares/

## 1️⃣ auth.middleware.js

```js
isLoggedIn
```

✔ JWT verify karta
✔ `req.user` me user data inject karta
✔ Unauthorized user ko rokta

---

## 2️⃣ multer.middleware.js

```js
upload.single("avatar")
```

✔ File receive karta
✔ `req.file` banata
✔ uploads/ folder me save karta

---

## 3️⃣ error.middleware.js

```js
(err, req, res, next)
```

✔ Sab errors ek jagah handle
✔ App crash hone se bachata

---

# 🔹 controllers/user.controller.js (BRAIN OF APP 🧠)

Yahin **actual logic** hota hai:

### Controllers ka kaam

✔ req.body / req.file read
✔ DB se baat
✔ Email / Cloudinary call
✔ Final response send

### Example Flow (Register):

```
Route
 ↓
multer middleware → req.file
 ↓
register controller
 ↓
User.create()
 ↓
Cloudinary upload
 ↓
JWT generate
 ↓
Cookie set
 ↓
Response
```

---

# 🔹 models/user.models.js (DATABASE LAYER)

```js
const userSchema = new mongoose.Schema({
  name,
  email,
  password,
  avatar,
  forgetPasswordToken,
  forgetPasswordExpiry
});
```

### Model ka role

✔ MongoDB schema
✔ Password hash (pre-save)
✔ Custom methods:

* `comparePassword()`
* `generateToken()`
* `generatePasswordResetToken()`

❌ Yahan **response / req handling nahi hota**

---

# 🔹 utils/error.util.js (CUSTOM ERROR)

```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
```

✔ Consistent error structure
✔ Status code control
✔ Clean error handling

---

# 🔹 config/

## dbConnection.js

✔ MongoDB connect

## cloudinary.js

✔ Cloudinary config

## sendEmail.js

✔ Nodemailer setup
✔ Reusable email sender

---

# 🔹 uploads/

✔ Temporary files
✔ Cloudinary upload ke baad delete ho jati hain

---

# 🔐 AUTH FLOW (LOGIN / PROTECTED ROUTES)

```
Login
 ↓
JWT generate
 ↓
Cookie set
 ↓
Request to protected route
 ↓
auth middleware
 ↓
req.user available
 ↓
Controller
```

---

# ✉️ FORGET / RESET PASSWORD FLOW

```
Forget Password
 ↓
Token generate (hashed)
 ↓
Email send
 ↓
User clicks link
 ↓
Reset Password
 ↓
Token verify
 ↓
Password update
```

---

# 🧠 GOLDEN RULES (INTERVIEW READY)

✔ Routes → sirf routing
✔ Controller → business logic
✔ Model → database logic
✔ Middleware → reusable logic
✔ Utils → helpers
✔ Config → external services

---

# ✅ FINAL SUMMARY

Tumhara project structure:

* **Scalable** hai
* **Industry standard** hai
* **Interview-ready** hai
* **Real-world LMS compatible** hai

---

