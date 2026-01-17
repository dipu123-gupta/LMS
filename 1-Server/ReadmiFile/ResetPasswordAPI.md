

---

# 🧠 RESET PASSWORD API – STEP BY STEP FLOW

---

## 🔹 STEP 0: User email ke link pe click karta hai

Email me jo link gaya tha:

```
https://frontend.com/reset-password/<resetToken>
```

Frontend:

* URL se `resetToken` nikalta hai
* Backend ko request bhejta hai:

```
POST /api/v1/user/reset-password/:resetToken
```

### Body:

```json
{
  "password": "newPassword123"
}
```

---

## 🔹 STEP 1: Controller execution start

```js
const resetPassword = async (req, res, next) => {
  try {
```

👉 Controller start
👉 `try–catch` → centralized error handling ke liye

---

## 🔹 STEP 2: Token & password read karna

```js
const { resetToken } = req.params;
const { password } = req.body;
```

👉 Token URL se aata hai
👉 New password body se

---

## 🔹 STEP 3: Token missing check

```js
if (!resetToken) {
  return next(new AppError("Reset token is missing", 400));
}
```

👉 Invalid request → turant reject

---

## 🔹 STEP 4: Password validation

```js
if (!password) {
  return next(new AppError("Password is required", 400));
}

if (password.length < 6) {
  return next(new AppError("Password must be at least 6 characters", 400));
}
```

👉 Weak / empty password allowed nahi
👉 Security + UX

---

## 🔹 STEP 5: Token ko hash karna (CRITICAL 🔥)

```js
const forgetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");
```

### Kyun hash kar rahe hain?

* DB me **hashed token** store hai
* URL se aaya token **plain text** hai
* Compare karne ke liye **same hashing** zaroori

👉 Plain token **kabhi DB me nahi hota**

---

## 🔹 STEP 6: Valid user find karna (Token + Expiry)

```js
const user = await User.findOne({
  forgetPasswordToken,
  forgetPasswordExpiry: { $gt: Date.now() }
});
```

### Yahan 2 condition check hoti hain:

1️⃣ Token match kare
2️⃣ Token expire na hua ho

✔ Dono true → user mil jata hai
❌ Koi bhi fail → invalid request

---

## 🔹 STEP 7: Invalid / expired token check

```js
if (!user) {
  return next(
    new AppError("Token is invalid or expired, please try again", 400)
  );
}
```

👉 Expired / wrong token → reset deny

---

## 🔹 STEP 8: New password set karna

```js
user.password = password;
```

👉 Plain password assign hota hai
👉 **Model ke pre-save hook** me bcrypt se hash hota hai

---

## 🔹 STEP 9: Reset token clear karna (ONE-TIME USE)

```js
user.forgetPasswordToken = undefined;
user.forgetPasswordExpiry = undefined;
```

👉 Token reuse nahi ho sakta
👉 Security ensured

---

## 🔹 STEP 10: User save karna

```js
await user.save();
```

👉 New password + cleared token DB me save

---

## 🔹 STEP 11: Final response send

```js
res.status(200).json({
  success: true,
  message: "Password changed successfully"
});
```

👉 Password reset complete 🎉
👉 User ab login kar sakta hai

---

## 🔁 ONE-LINE FLOW

```
Email link → Token read → Hash token
→ DB token + expiry check
→ New password set → Token clear → Save → Response
```

---

# 🧠 INTERVIEW READY LINE

> “Reset password API me server URL se aaye token ko hash karke database ke token se compare karta hai, expiry validate karta hai, phir password update karke token ko invalidate kar deta hai.”

---

# 🔐 SECURITY HIGHLIGHTS (VERY IMPORTANT)

✔ Plain token DB me store nahi hota
✔ Token time-bound hota hai
✔ Token one-time usable
✔ Password bcrypt se hash hota hai

---
