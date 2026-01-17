
---

# 🧠 SEND EMAIL – STEP BY STEP FLOW

---

## 🔹 STEP 0: `sendEmail` function call hota hai

Kahin se (mostly `forgetPassword` controller):

```js
await sendEmail(email, subject, message);
```

👉 Yahan:

* `email` → receiver
* `subject` → email ka title
* `message` → HTML body

---

## 🔹 STEP 1: Function execution start

```js
const sendEmail = async (to, subject, message) => {
  try {
```

👉 Async function
👉 `try–catch` → SMTP error handle karne ke liye

---

## 🔹 STEP 2: Nodemailer transporter create hota hai

```js
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});
```

### Transporter kya hota hai?

👉 SMTP server ke sath **connection config**

### ENV variables ka role:

| ENV Variable  | Kya karta hai                 |
| ------------- | ----------------------------- |
| SMTP_HOST     | SMTP server address           |
| SMTP_PORT     | Usually `587`                 |
| SMTP_USERNAME | Email username                |
| SMTP_PASSWORD | Email password / app password |
| secure: false | TLS (587 ke liye)             |

---

## 🔹 STEP 3: Mail options define hote hain

```js
const mailOptions = {
  from: `"Support Team" <${process.env.SMTP_FROM_EMAIL}>`,
  to,
  subject,
  html: message
};
```

### Yahan kya ho raha hai?

✔ `from` → sender name + email
✔ `to` → receiver email
✔ `subject` → email subject
✔ `html` → HTML email body

👉 Email **professionally formatted** hota hai

---

## 🔹 STEP 4: Email send hoti hai

```js
await transporter.sendMail(mailOptions);
```

👉 Nodemailer:

* SMTP server se connect karta hai
* Email queue karta hai
* Receiver ke mail server tak pahunchata hai

📧 Inbox me email chali jati hai 🎉

---

## 🔹 STEP 5: Success case

👉 Agar koi error nahi:

* Function silently return ho jata hai
* Controller next line execute karta hai

---

## 🔹 STEP 6: Error aaya to kya hota hai?

```js
catch (error) {
  console.error("SMTP ERROR 👉", error);
  throw new Error("Email could not be sent");
}
```

👉 SMTP error:

* Wrong credentials
* Wrong host / port
* Gmail security block

➡️ New error throw hota hai
➡️ Controller ke `catch` me jata hai
➡️ Global error middleware handle karta hai

---

# 🔁 ONE-LINE FLOW

```
Controller → sendEmail
→ Create transporter → Prepare mail
→ SMTP send → Success / Error
```

---

# 🧠 INTERVIEW READY LINE

> “sendEmail utility Nodemailer ke through SMTP transporter create karti hai, mail options set karti hai aur HTML email send karti hai. Error aane par centralized error handling ko trigger karti hai.”

---

# 🔐 SECURITY & BEST PRACTICES

✔ Credentials `.env` me
✔ HTML email support
✔ Reusable utility
✔ Error abstraction (generic message)

---

# ⚠️ COMMON ISSUES & FIX

### ❌ Email nahi ja rahi?

✔ Check `.env` variables
✔ Gmail ke liye **App Password** use karo
✔ Port `587` + `secure:false`

---

## ✅ SAMPLE `.env`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

---
