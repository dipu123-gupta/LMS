
---

## 🔹 Tumhara Code Kya Kar Raha Hai (Line by Line)

```js
import path from "path";
import multer from "multer";
```

👉 `path` → file extension nikalne ke liye
👉 `multer` → file upload handle karne ke liye

---

```js
const upload = multer({
```

👉 `upload` ek middleware ban raha hai jo routes me use hoga

---

### 1️⃣ Destination Folder

```js
dest: "uploads/",
```

⚠️ **NOTE**
Agar tum `storage` use kar rahe ho, to `dest` likhne ki **zarurat nahi hoti**
Ye optional hai (conflict create nahi karta, but redundant hai)

---

### 2️⃣ File Size Limit (50MB)

```js
limits: { fileSize: 50 * 1024 * 1024 },
```

👉 Max **50MB** ka file upload allow
Agar limit cross hui → Multer error throw karega

---

### 3️⃣ Storage Configuration

```js
storage: multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
}),
```

✔ File **uploads/** folder me save hoga
✔ File ka **same original name** rahega

⚠️ **Problem**
Agar same name ki 2 files aayi → **overwrite ho jayegi**

---

### 4️⃣ File Type Validation

```js
fileFilter: (_req, file, cb) => {
  let ext = path.extname(file.originalname);
```

👉 File ka extension nikal raha hai

---

```js
if (
  ext !== ".jpg" &&
  ext !== ".jpeg" &&
  ext !== ".webp" &&
  ext !== ".png" &&
  ext !== ".mp4"
)
```

✔ Sirf images & mp4 allow
❌ Baaki sab reject

---

```js
cb(new Error(`Unsupported file type! ${ext}`), false);
```

👉 Galat file type pe error throw

---

```js
cb(null, true);
```

👉 File valid hai → upload allowed

---

## ⚠️ Issues / Improvements (Important)

### ❌ 1. Same Filename Overwrite

Agar 2 user same naam ki file upload kare → pehli delete ho jayegi

### ❌ 2. Sirf extension check (secure nahi)

Best practice: **MIME type bhi check karo**

---

## ✅ Best Practice Multer Config (Recommended)

👇 **Is version ko direct use karo (Production ready)**

```js
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "video/mp4",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Only images & mp4 videos are allowed"), false);
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter,
});

export default upload;
```

---

## 🔹 Route Me Use Kaise Kare

### Single File

```js
router.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    success: true,
    file: req.file,
  });
});
```

### Multiple Files

```js
router.post("/uploads", upload.array("files", 5), (req, res) => {
  res.json({
    success: true,
    files: req.files,
  });
});
```

---

## 🔹 Summary (Simple Words)

✔ Multer → file upload ke liye
✔ `diskStorage` → file kaha & kaise save hogi
✔ `limits` → max file size
✔ `fileFilter` → kaun si file allow hai
✔ Unique filename → overwrite problem solve

---


