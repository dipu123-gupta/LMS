

# 🧠 CHANGE PASSWORD API – STEP BY STEP FLOW

---

## 🔹 STEP 0: Client request (Protected Route 🔐)

Client se request aati hai:

```
POST /api/v1/user/change-password
```

### Headers / Cookies:

* Browser me **JWT cookie (`token`)** already set hoti hai

### Body:

```json
{
  "oldPassword": "oldPass123",
  "newPassword": "newPass456"
}
```

👉 **Auth middleware pehle execute hota hai**

* JWT verify karta hai
* `req.user = { id }` set karta hai

---

## 🔹 STEP 1: Controller execution start

```js
const changePassword = async (req, res, next) => {
```

👉 Ab controller ko **trusted user id** mil chuki hoti hai

---

## 🔹 STEP 2: req.body & req.user se data read

```js
const { oldPassword, newPassword } = req.body;
const { id } = req.user;
```

👉 `oldPassword` → verification ke liye
👉 `newPassword` → set karne ke liye
👉 `id` → JWT se aayi hui user id

---

## 🔹 STEP 3: Validation – fields empty check

```js
if (!oldPassword || !newPassword) {
  return next(new AppError("All field are mandatory", 400));
}
```

👉 Koi field missing → turant error
👉 Neeche ka code execute nahi hoga

---

## 🔹 STEP 4: Database se user fetch (Password ke sath)

```js
const user = await User.findById(id).select("+password");
```

### Important 🔥

* Password normally hidden hota hai
* `.select("+password")` sirf yahan use hota hai

---

## 🔹 STEP 5: User exist check

```js
if (!user) {
  return next(new AppError("User does not exist", 400));
}
```

👉 Rare case but safety ke liye

---

## 🔹 STEP 6: Old password verify karna

```js
const isPasswordValid = await user.comparePassword(oldPassword);
```

### Internally:

* `oldPassword` → bcrypt hash
* DB ke hash se compare

---

## 🔹 STEP 7: Wrong old password case

```js
if (!isPasswordValid) {
  return next(new AppError("Invalid old password", 400));
}
```

👉 Galat password → change denied
👉 Security ensured

---

## 🔹 STEP 8: New password set karna

```js
user.password = newPassword;
```

👉 Plain password assign hota hai
👉 **Model ke pre-save hook** me automatically bcrypt hash ho jata hai

---

## 🔹 STEP 9: User save karna

```js
await user.save();
```

👉 New hashed password DB me persist

---

## 🔹 STEP 10: Password hide karna (extra safety)

```js
user.password = undefined;
```

👉 Response me password nahi jana chahiye

---

## 🔹 STEP 11: Final response send

```js
res.status(200).json({
  success: true,
  message: "password change successfully",
});
```

👉 Password change complete 🎉

---

# 🔁 ONE-LINE FLOW

```
Auth → req.user.id → Fetch user
→ Verify old password → Set new password
→ Save → Response
```

---

# 🧠 INTERVIEW READY LINE

> “Change password API ek protected route hota hai jisme server pehle old password verify karta hai, phir new password set karke bcrypt ke through hash karta hai.”

---

# 🔐 SECURITY HIGHLIGHTS

✔ JWT based authentication
✔ Old password mandatory
✔ Bcrypt hashing via pre-save hook
✔ Password response me nahi jata

---

