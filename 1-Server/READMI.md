
**Morgan actually Express.js ka middleware hai**, jo **server-side HTTP request logging** ke kaam aata hai.

---

## Morgan kya hai? (Simple words me)

**Morgan** ek **HTTP request logger middleware** hai jo batata hai:

* kaunsi request aayi (`GET /api/users`)
* status code kya tha (`200`, `404`)
* response time kitna laga
* user ka IP, method, URL, etc.

Ye sab **backend (Node + Express)** me hota hai, **React (frontend)** me nahi.

---

![Image](https://signoz.io/img/blog/2022/12/morgan_logger_docker_build.webp)

![Image](https://cdn.sanity.io/images/rdn92ihu/production/e9c951bec7f8992af35907b2e2dae2648105cee6-3688x1626.png?auto=format\&fit=max\&h=1626\&w=3688)

![Image](https://www.kentosystems.com/wp-content/uploads/2020/10/node.jsreact-application-architecture-1024x431.jpg)

---

## Phir log React ke sath Morgan ka naam kyun lete hain?

Kyuki **React frontend + Express backend** ek common setup hai.

Flow samjho 👇

```
React (Frontend)
   ↓ API call (axios / fetch)
Express (Backend)
   ↓
Morgan (request log karta hai)
```

👉 Isliye log bol dete hain: *“React project me Morgan use ho raha hai”*
Actual me **Morgan backend me hota hai**, React ke code me nahi.

---

## Morgan ka real use (Express me)

Example 👇

```js
const express = require("express");
const morgan = require("morgan");

const app = express();

// Morgan middleware
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(5000, () => {
  console.log("Server running");
});
```

### Output terminal me kuch aisa dikhega:

```
GET / 200 5.123 ms - 11
```

---

## Common Morgan formats

* `"dev"` → colorful, short (development ke liye best)
* `"combined"` → detailed logs (production)
* `"tiny"` → very small logs

```js
app.use(morgan("combined"));
```

---

## React me logging ka alternative kya hai?

React ke andar agar logging chahiye to:

* `console.log()`
* Custom logger
* Error tracking tools:

  * Sentry
  * LogRocket

👉 **Morgan React ke liye nahi bana**.

---

## Interview me bolne ke liye perfect answer ✅

> **Morgan React ka part nahi hai. Ye Express.js ka middleware hai jo backend me HTTP requests ko log karta hai. React + Express project me, jab React frontend backend APIs ko call karta hai, tab Morgan un requests ko server side pe track karta hai.**

------
===================================================
`app.use(express.json());` **Express.js ka built-in middleware** hai, jo **incoming HTTP request ke JSON data ko read & parse** karta hai.

---

## Simple language me

👉 Jab **frontend (React / Postman / mobile app)** se **JSON format me data** aata hai
👉 to Express by default usse samajh nahi pata
👉 **express.json()** us JSON ko **JavaScript object (`req.body`)** me convert kar deta hai

---

![Image](https://miro.medium.com/0%2AjBGKXazN_5f9d9Ie.png)

![Image](https://miro.medium.com/1%2AkMNzu4zx40QvwQUWa9dCOw.png)

![Image](https://media.geeksforgeeks.org/wp-content/uploads/20230716220315/RESTAPI.png)

---

## Ye kyun zaroori hai?

Agar ye line nahi likhi 👇

```js
app.use(express.json());
```

Aur aap POST request bhejo:

```json
{
  "email": "test@gmail.com",
  "password": "123456"
}
```

To 👇

```js
console.log(req.body);
```

Output hoga:

```js
undefined
```

---

## express.json() ke baad kya hota hai?

```js
app.use(express.json());

app.post("/login", (req, res) => {
  console.log(req.body);
  res.send("Data received");
});
```

### Output:

```js
{
  email: "test@gmail.com",
  password: "123456"
}
```

---

## express.json() actually kya karta hai?

* Request ke **body stream** ko read karta hai
* JSON ko **parse** karta hai
* `req.body` me store karta hai
* Sirf **Content-Type: application/json** ke liye kaam karta hai

---

## express.urlencoded() se difference

```js
app.use(express.urlencoded({ extended: true }));
```

| Middleware             | Data type                           |
| ---------------------- | ----------------------------------- |
| `express.json()`       | JSON data                           |
| `express.urlencoded()` | Form data (`x-www-form-urlencoded`) |

👉 Modern React apps me mostly **JSON**, isliye `express.json()` must hai.

---

## Real project me common setup

```js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

---

## Interview ke liye short answer ✅

> **`app.use(express.json())` Express ka middleware hai jo incoming JSON request body ko parse karke `req.body` me available karata hai. Ye React ya kisi bhi client se aane wale JSON data ko handle karne ke liye use hota hai.**

`app.use(cookieParser());` **Express.js ka middleware** hai jo **incoming HTTP request ke cookies ko read (parse)** karta hai.

---

## Simple language me

👉 Browser jab request ke sath **cookies bhejta hai**
👉 Express by default cookies ko read nahi kar pata
👉 **cookie-parser** un cookies ko **parse karke `req.cookies` me daal deta hai**

---

![Image](https://miro.medium.com/1%2AaC8ivqucCSXKw9EACKmWzg.jpeg)

![Image](https://developer.mozilla.org/shared-assets/images/diagrams/http/cookies/cookie-basic-example.png)

![Image](https://miro.medium.com/v2/resize%3Afit%3A1400/1%2AwccGR2fmBvWBws-xQoeLhA.jpeg)

---

## cookieParser() kyun zaroori hai?

Agar aap **JWT / session / auth token cookies me store** kar rahe ho, to bina `cookieParser()` ke:

```js
req.cookies   // undefined
```

---

## cookieParser() use ka example

### Install

```bash
npm install cookie-parser
```

### Use in app.js

```js
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.get("/", (req, res) => {
  console.log(req.cookies);
  res.send("Cookies read");
});
```

### Browser se cookie aayi:

```
token=abc123
user=admin
```

### Output:

```js
{
  token: "abc123",
  user: "admin"
}
```

---

## cookieParser() internally kya karta hai?

* Request header me se **Cookie string** uthata hai
* Usse **key-value object** me convert karta hai
* `req.cookies` me attach karta hai
* Agar secret diya ho → **signed cookies** bhi verify karta hai

---

## Signed cookies example

```js
app.use(cookieParser("mySecretKey"));

res.cookie("token", "abc123", { signed: true });
```

```js
req.signedCookies.token
```

---

## Authentication me use

React + Express app me common flow 👇

1. Login success
2. Server:

```js
res.cookie("token", jwtToken, {
  httpOnly: true,
  secure: true,
});
```

3. Next requests me:

```js
req.cookies.token
```

👉 Isliye auth middleware me **cookieParser required** hota hai.

---

## cookieParser vs express.json

| Middleware       | Kaam            |
| ---------------- | --------------- |
| `express.json()` | JSON body parse |
| `cookieParser()` | Cookies parse   |

---

## Interview ready answer ✅

> **`app.use(cookieParser())` Express middleware hai jo incoming HTTP request ke cookies ko parse karke `req.cookies` (aur signed cookies ke liye `req.signedCookies`) me available karata hai. Ye authentication aur session handling me use hota hai.**


---

# 🧠 Project me File Upload ka COMPLETE LOGIC

Tumhare project me **file upload 4 layers me likha gaya hai** 👇

---

## 1️⃣ Multer Middleware (File ko pakadne ka logic)

📁 **`middlewares/multer.middleware.js`**

### 📌 Yahan kya hota hai?

* Client se aane wali **file ko receive** karta hai
* File ko temporary **`uploads/` folder** me save karta hai
* File type & size validate karta hai

### 🔑 Core logic

```js
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (![".jpg",".jpeg",".png",".webp",".mp4"].includes(ext)) {
      cb(new Error("Unsupported file type"), false);
      return;
    }
    cb(null, true);
  },
});
```

📌 **Is file ka kaam sirf ye hai**
👉 “Jo bhi file aaye, usko disk par save kar do”

---

## 2️⃣ Route Level par Multer ka Use

📁 **`routes/user.routes.js`**

### 📌 Yahan multer actually USE hota hai

```js
authRouter.post(
  "/register",
  upload.single("avatar"),
  register
);
```

### 🧠 Yahan kya ho raha hai?

* `upload.single("avatar")`:

  * Request se **`avatar` naam ki file** nikalta hai
  * Disk me save karta hai
  * `req.file` bana deta hai

👉 **Iske bina `req.file` kabhi milegi hi nahi**

---

## 3️⃣ Controller me File ka Real Use

📁 **`controllers/user.controller.js`**

### 📌 Yahan file ka actual kaam hota hai

```js
if (req.file) {
  const result = await cloudinary.v2.uploader.upload(req.file.path, {
    folder: "lms",
    width: 250,
    height: 250,
    crop: "fill",
    gravity: "faces",
  });

  user.avatar.public_id = result.public_id;
  user.avatar.secure_url = result.secure_url;

  fs.rmSync(`uploads/${req.file.filename}`, { force: true });
}
```

### 🧠 Step-by-step

1. `req.file` mila (multer se)
2. Local path → Cloudinary upload
3. Cloudinary se:

   * `public_id`
   * `secure_url`
4. Ye dono **MongoDB user document me save**
5. Local file delete (cleanup)

---

## 4️⃣ Database me File ka Structure

📁 **`models/user.models.js`**

```js
avatar: {
  public_id: String,
  secure_url: String,
},
```

📌 Matlab:

* **Actual image Cloudinary me**
* **DB me sirf image ka reference**

---

# 🔁 COMPLETE FLOW (One Shot me samjho)

```
Postman / Frontend
  ↓
form-data (avatar = File)
  ↓
Route (upload.single)
  ↓
Multer
  → uploads/avatar.jpg
  ↓
Controller
  → Cloudinary upload
  → DB save (URL)
  → Local file delete
```

---

# ❌ Tum URL bhejoge to kya hoga?

Agar tum bhejte ho:

```text
avatar = "https://google.com/image.jpg"
```

👉 To:

* multer ignore karega
* `req.file === undefined`
* default avatar save ho jayega

✅ **Isliye tumhe hamesha FILE bhejni hoti hai**

---

# 🟢 Tumhare Project me Kitne Type ke Upload Supported hain?

| Type           | Supported | Kaise                       |
| -------------- | --------- | --------------------------- |
| Image file     | ✅         | multer + cloudinary         |
| Video (.mp4)   | ✅         | multer                      |
| Image URL      | ❌         | logic nahi likha            |
| Multiple files | ❌         | `upload.single` use ho raha |

---

# 🧪 Tumhara Logic Industry Standard hai?

✅ Haan
Ye exactly wahi pattern hai jo:

* LMS
* E-commerce
* Social media apps

use karte hain

---

## ✅ FINAL SUMMARY

* ✔ Multer → file receive
* ✔ Route → multer attach
* ✔ Controller → cloudinary upload
* ✔ DB → URL store
* ✔ Local file → delete

---

# 🔐 FORGET PASSWORD → RESET PASSWORD

## 🔁 Complete Flow (Step by Step)

---

## 🟢 PART-1 : `forgetPassword` ka Logic

### STEP 1️⃣ – Email lena (User Request)

```js
const { email } = req.body;
```

👉 User frontend se email submit karta hai
👉 Example:

```json
{
  "email": "user@gmail.com"
}
```

---

### STEP 2️⃣ – Email validation

```js
if (!email) {
  return next(new AppError("Email is required", 400));
}
```

👉 Agar email empty hai → error
👉 Isse **server crash** nahi hota, clean error milta hai

---

### STEP 3️⃣ – User exist karta hai ya nahi

```js
const user = await User.findOne({ email });
```

```js
if (!user) {
  return next(new AppError("Email not registered", 400));
}
```

👉 DB me check hota hai
👉 Fake email wale user ko yahin reject kar dete hain
👉 Security + performance dono better

---

### STEP 4️⃣ – Reset Token generate hona (MOST IMPORTANT)

```js
const resetToken = user.generatePasswordResetToken();
```

📌 **Is function ke andar kya hota hai (Model me):**

```js
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.forgetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.forgetPasswordExpiry = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
```

### 🔐 Yahan kya logic hai?

| Cheez                  | Reason                 |
| ---------------------- | ---------------------- |
| random token           | Guess nahi ho sakta    |
| DB me **hashed token** | Security               |
| Expiry time            | Token lifetime limited |

---

### STEP 5️⃣ – Token DB me save karna

```js
await user.save();
```

👉 Token + expiry MongoDB me save hota hai
👉 `await` isliye important hai

---

### STEP 6️⃣ – Reset Password URL banana

```js
const resetPasswordURL =
`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
```

👉 Ye **plain token** frontend ko diya jata hai
👉 DB me **hashed token** hota hai
👉 Hacker token dekh ke password reset nahi kar sakta

---

### STEP 7️⃣ – Email send karna

```js
await sendEmail(email, subject, message);
```

👉 User ke email pe link chala jata hai
👉 User click karega → frontend page open

---

### STEP 8️⃣ – Success response

```js
res.status(200).json({
  success: true,
  message: "Reset password link generated"
});
```

---

## 🔴 PART-2 : `resetPassword` ka Logic

---

### STEP 1️⃣ – Token URL se lena

```js
const { resetToken } = req.params;
```

👉 URL:

```
/reset-password/abc123token
```

---

### STEP 2️⃣ – New password lena

```js
const { password } = req.body;
```

👉 Frontend se:

```json
{
  "password": "newPassword123"
}
```

---

### STEP 3️⃣ – Password validation

```js
if (!password || password.length < 6)
```

👉 Weak password reject
👉 Security reason

---

### STEP 4️⃣ – Token hash banana

```js
const forgetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");
```

📌 **Why?**

* DB me token **hashed form** me hai
* Comparison ke liye same hash banana padta hai

---

### STEP 5️⃣ – User find karna (Token + Expiry)

```js
const user = await User.findOne({
  forgetPasswordToken,
  forgetPasswordExpiry: { $gt: Date.now() }
});
```

✔ Token match
✔ Token expired nahi

👉 Dono condition true honi chahiye

---

### STEP 6️⃣ – New password set karna

```js
user.password = password;
```

👉 Pre-save hook:

```js
userSchema.pre("save", function () {
  this.password = bcrypt.hash(this.password);
});
```

👉 Password **auto hash** ho jata hai

---

### STEP 7️⃣ – Token remove karna (VERY IMPORTANT)

```js
user.forgetPasswordToken = undefined;
user.forgetPasswordExpiry = undefined;
```

👉 Token ek baar hi use ho
👉 Reuse attack se protection

---

### STEP 8️⃣ – Save user

```js
await user.save();
```

---

### STEP 9️⃣ – Final response

```js
res.status(200).json({
  success: true,
  message: "Password changed successfully"
});
```

---

## 🔄 COMPLETE FLOW SUMMARY

```
User → forgetPassword (email)
        ↓
Token generate + Email send
        ↓
User clicks email link
        ↓
resetPassword (token + new password)
        ↓
Token verify + password update
```

---

## 🎯 INTERVIEW LINE (Important)

> "We never store reset token in plain text, only hashed token with expiry is stored. During reset, we hash incoming token and compare it with DB."

---




