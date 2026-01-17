

# 🧠 UPDATE PROFILE API – STEP BY STEP FLOW

---

## 🔹 STEP 0: Client request (Protected Route 🔐)

Client se request aati hai:

```
PUT /api/v1/user/update-profile
```

### Is route me:

```js
router.put(
  "/update-profile",
  isLoggedIn,
  upload.single("avatar"),
  updateProfile
);
```

👉 **Auth middleware pehle chalega**
👉 **Multer middleware second chalega**

---

## 🔹 STEP 1: Auth middleware (`isLoggedIn`)

✔ JWT cookie read hoti hai
✔ Token verify hota hai
✔ `req.user = { id }` set hota hai
✔ `next()` call

---

## 🔹 STEP 2: Multer middleware

✔ File receive hoti hai
✔ `uploads/` folder me save hoti hai
✔ `req.file` available ho jata hai

👉 Agar file nahi bheji:

* `req.file === undefined`

---

## 🔹 STEP 3: Controller execution start

```js
const updateProfile = async (req, res, next) => {
```

👉 Ab:

* `req.user.id` available
* `req.body.fullName` available
* `req.file` optional

---

## 🔹 STEP 4: req.body & req.user read karna

```js
const { fullName } = req.body;
const { id } = req.user;
```

👉 fullName → optional
👉 id → trusted JWT se

---

## 🔹 STEP 5: Database se user fetch

```js
const user = await User.findById(id);
```

👉 MongoDB query:

* `_id = id`

---

## 🔹 STEP 6: User exist check

```js
if (!user) {
  return next(new AppError("User does not exist", 400));
}
```

👉 Invalid user → request fail

---

## 🔹 STEP 7: Name update (OPTIONAL)

```js
if (fullName) {
  user.name = fullName;
}
```

👉 Agar user ne name bheja hai → update
👉 Nahi bheja → skip

---

## 🔹 STEP 8: Avatar update check (OPTIONAL)

```js
if (req.file) {
```

👉 Ye block **sirf tab chalega** jab:

* User ne new avatar upload ki ho

---

### 🔹 STEP 8.1: Old avatar delete (Cloudinary)

```js
await cloudinary.uploader.destroy(user.avatar.public_id);
```

👉 Purani image Cloudinary se delete
👉 Storage clean

---

### 🔹 STEP 8.2: New avatar upload

```js
const result = await cloudinary.uploader.upload(req.file.path, {
  folder: "lms",
  width: 250,
  height: 250,
  gravity: "faces",
  crop: "fill",
});
```

👉 Local file → Cloudinary
👉 Resize + crop applied

---

### 🔹 STEP 8.3: DB object update

```js
if (result) {
  user.avatar.public_id = result.public_id;
  user.avatar.secure_url = result.secure_url;
}
```

👉 User ke avatar ka reference update

---

### 🔹 STEP 8.4: Local file delete

```js
fs.rmSync(`uploads/${req.file.filename}`, { force: true });
```

👉 Server ke uploads folder ko clean rakha

---

### 🔹 STEP 8.5: Error case (Cloudinary)

```js
catch (error) {
  return next(new AppError(error.message || "File upload failed", 500));
}
```

👉 Agar upload fail:

* Request fail
* Global error middleware handle karega

---

## 🔹 STEP 9: Final user save

```js
await user.save();
```

👉 Name + avatar changes DB me persist

---

## 🔹 STEP 10: Response send

```js
res.status(200).json({
  success: true,
  message: "User detailed updated successfully",
});
```

👉 Profile update complete 🎉

---

# 🔁 ONE-LINE FLOW

```
Auth → Multer → Fetch user
→ Update name → Delete old avatar
→ Upload new avatar → Save → Response
```

---

# 🧠 INTERVIEW READY LINE

> “Update profile API me server pehle user authenticate karta hai, phir optional name aur avatar update karta hai. Avatar ke case me pehle purani image Cloudinary se delete hoti hai, phir nayi image upload karke database update hota hai.”

---

# 🔐 SECURITY & BEST PRACTICES

✔ JWT based authentication
✔ User id body se nahi li
✔ Cloudinary cleanup
✔ Local uploads cleanup
✔ Centralized error handling

---

# ⚠️ SMALL IMPROVEMENTS (OPTIONAL)

### 1️⃣ Old avatar delete **after** successful upload (safer)

```js
const result = await cloudinary.uploader.upload(...);
await cloudinary.uploader.destroy(user.avatar.public_id);
```

### 2️⃣ Production me filename direct path use karo

```js
fs.rmSync(req.file.path, { force: true });
```


