import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectionToDB from "./config/dbConnection.js";
import { v2 } from "cloudinary";

const PORT = process.env.PORT || 5000;

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectionToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(error));