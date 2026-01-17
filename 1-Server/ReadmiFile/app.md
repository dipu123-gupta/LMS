

---

## 1️⃣ Imports ka kaam

```js
import cookieParser from 'cookie-parser';
```

➡️ Cookies read karne ke liye
➡️ JWT token agar cookie me store hai to `req.cookies` me milega

---

```js
import { config } from "dotenv";
config();
```

➡️ `.env` file ko load karta hai
➡️ `process.env.PORT`, `FRONTEND_URL`, `JWT_SECRET` etc yahi se aate hain

⚠️ **Best Practice**

```js
config({ path: "./.env" });
```

---

```js
import express from 'express';
```

➡️ Express framework import

---

```js
import cors from 'cors';
```

➡️ Frontend aur backend ko connect karne ke liye
➡️ Cross-origin requests allow karta hai

---

```js
import morgan from 'morgan';
```

➡️ HTTP request logger
➡️ Console me request ka log show karta hai

---

```js
import errorMiddleware from './middlewares/error.middleware.js';
```

➡️ Central error handling middleware
➡️ `next(err)` ke through aane wale errors yahi handle hote hain

---

```js
import authRouter from './routes/user.routes.js'
```

➡️ User related saare routes (register, login, profile etc)

---

## 2️⃣ Express app create

```js
const app = express();
```

➡️ Ye pura backend application hai

---

## 3️⃣ Global Middlewares

```js
app.use(express.json());
```

➡️ JSON body ko read karne ke liye
➡️ `req.body` kaam nahi karega iske bina

---

```js
app.use(cookieParser());
```

➡️ Cookies ko parse karta hai
➡️ JWT authentication ke liye mandatory

---

```js
app.use(morgan('dev'));
```

➡️ Console log format:

```
GET /api/v1/user/profile 200 12ms
```

---

```js
app.use(express.urlencoded({ extended: true }));
```

➡️ HTML form data ke liye
➡️ `multipart/form-data` me multer use hota hai, ye uske alawa ka data handle karta hai

---

## 4️⃣ CORS Configuration (IMPORTANT)

```js
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
```

➡️ Sirf isi frontend ko allow karega jo `.env` me defined hai
➡️ `credentials:true` ka matlab:

* Cookies
* Authorization headers
  allowed hain

📌 `.env`

```
FRONTEND_URL=http://localhost:5173
```

---

## 5️⃣ Ping Route (Health Check)

```js
app.use('/ping', (req, res) => {
    res.send('/pong');
});
```

⚠️ **Typo hai yaha**

### ❌ Current Output

```
/pong
```

### ✅ Better

```js
res.send('pong');
```

➡️ Ye route server alive hai ya nahi check karne ke liye hota hai

---

## 6️⃣ Main Routes (IMPORTANT BUG 🚨)

```js
app.use('/api/vi/user', authRouter)
```

### ❌ BIG MISTAKE

`vi` likha hai ❌

### ✅ Correct

```js
app.use('/api/v1/user', authRouter);
```

Agar frontend `/api/v1/user/login` call karega to abhi **404 milega**

---

## 7️⃣ 404 Route Handler

```js
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
```

➡️ Agar koi route exist nahi karta
➡️ Ye middleware response dega

📌 Example:

```
GET /abc
```

Response:

```json
{
  "message": "Route not found"
}
```

---

## 8️⃣ Error Handling Middleware (LAST ME HONA ZAROORI)

```js
app.use(errorMiddleware);
```

➡️ Saare errors yaha aayenge
➡️ Ye **hamesha sabse last** hona chahiye ✅

---

## 9️⃣ Export App

```js
export default app;
```

➡️ `server.js / index.js` me import hoga

Example:

```js
import app from './app.js';

app.listen(5000, () => {
  console.log('Server running');
});
```

---

## ✅ FINAL CORRECTED app.js (IMPORTANT)

```js
import cookieParser from 'cookie-parser';
import { config } from "dotenv";
config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import errorMiddleware from './middlewares/error.middleware.js';
import authRouter from './routes/user.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.use('/api/v1/user', authRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use(errorMiddleware);

export default app;
```

---

## 🔥 Verdict (Interview Ready)

✔ Structure professional hai
✔ Middleware order correct
✔ Security + scalability friendly
❌ Sirf **2 mistakes thi**:

1. `/api/vi/user` ❌
2. `/pong` typo

---
