
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