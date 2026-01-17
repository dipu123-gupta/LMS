
---

# 🧠 FORGET PASSWORD API – STEP BY STEP FLOW

---

## 🔹 STEP 0: Client request aati hai

Client (React / Postman) se request:

```
POST /api/v1/user/forget-password
```

### Request body:

```json
{
  "email": "test@gmail.com"
}
```

👉 Is route me **login required nahi hota**

---

## 🔹 STEP 1: Controller execution start

```js
const forgetPassword = async (req, res, next) => {
  try {
```

👉 Controller start
👉 `try-catch` → error ko global handler tak bhejne ke liye

---

## 🔹 STEP 2: req.body se email read karna

```js
const { email } = req.body;
```

👉 User ne jis email pe reset chahiye, wo uthaya

---

## 🔹 STEP 3: Validation – email present hai ya nahi

```js
if (!email) {
  return next(new AppError("Email is required", 400));
}
```

👉 Email missing → turant error
👉 Neeche ka code execute nahi hoga

---

## 🔹 STEP 4: Database me user exist check

```js
const user = await User.findOne({ email });
```

👉 MongoDB me check:

* Kya is email ka user registered hai?

```js
if (!user) {
  return next(new AppError("Email not registered", 400));
}
```

👉 Security + correctness:

* Invalid emails pe reset link nahi bhejna

---

## 🔹 STEP 5: Reset token generate karna (MOST IMPORTANT 🔥)

```js
const resetToken = user.generatePasswordResetToken();
```

### Is function ke andar kya hota hai?

(Conceptual flow)

```
Random token generate
 ↓
Token ka SHA256 hash banaya
 ↓
DB me hashed token save
 ↓
Expiry time set (15 min)
 ↓
Plain token return
```

### Example:

```js
resetToken = "abc123xyz"          // plain (email me jayega)
forgetPasswordToken = "hashed..." // DB me save
forgetPasswordExpiry = Date.now() + 15 min
```

👉 **Plain token kabhi DB me store nahi hota**
👉 **DB breach ho to bhi safe**

---

## 🔹 STEP 6: User document save karna

```js
await user.save();
```

👉 Kyun?

* Token & expiry DB me persist karne ke liye

---

## 🔹 STEP 7: Reset password URL banana

```js
const resetPasswordURL =
  `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
```

👉 Ye URL:

* Email me jayega
* Frontend ke reset page pe le jayega

Example:

```
https://frontend.com/reset-password/abc123xyz
```

---

## 🔹 STEP 8: Email content banana

```js
const subject = "Reset Password";
```

```js
const message = `
  <p>You requested a password reset.</p>
  ...
`;
```

👉 HTML email:

* Professional
* Clickable link
* Manual copy option

---

## 🔹 STEP 9: Email send karna

```js
await sendEmail(email, subject, message);
```

👉 `sendEmail` internally:

* Nodemailer use karta
* SMTP se email bhejta

📧 Email user ke inbox me chali jati hai

---

## 🔹 STEP 10: Final response send

```js
res.status(200).json({
  success: true,
  message: "Reset password link generated",
  resetPasswordURL, // test ke liye
});
```

👉 Client ko confirmation milta hai
👉 (Dev mode me URL return kiya ja sakta hai)

⚠️ **Production me**:

```js
resetPasswordURL ❌ (remove karna chahiye)
```

---

## 🔹 STEP 11: Error handling

```js
catch (error) {
  next(error);
}
```

👉 Email fail / DB issue / token error
👉 Global error middleware handle karega

---

# 🔁 ONE-LINE FLOW

```
Request → Email validation → User check
→ Reset token generate → DB save
→ Reset link create → Email send → Response
```

---

# 🧠 INTERVIEW READY LINE

> “Forget password API me server ek secure reset token generate karta hai, uska hashed version database me store hota hai, aur plain token email ke through user ko bheja jata hai with expiry time.”

---

# ⚠️ SECURITY POINTS (VERY IMPORTANT)

✔ Plain token DB me store nahi hota
✔ Token time-bound hota hai
✔ Email verify hone ke baad hi reset allow
✔ One-time usable token

---

# ❌ COMMON MISTAKES (JO TUMNE AVOID KIYE)

❌ Plain token DB me store karna
❌ Expiry na lagana
❌ User exist check skip karna
❌ Password directly reset kar dena

---

