import Contact from "../models/contact.model.js";
import AppError from "../utils/error.util.js";

const contactUs = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // 1️⃣ Validation
    if (!name || !email || !message) {
      return next(new AppError("All fields are required", 400));
    }

    // 2️⃣ Save to database
    const contact = await Contact.create({
      name,
      email,
      message,
    });

    // 3️⃣ OPTIONAL: Admin email
    /*
    await sendEmail(
      "admin@gmail.com",
      "New Contact Message",
      `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    );
    */

    // 4️⃣ Response
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contact,
    });
  } catch (error) {
    next(error);
  }
};

export default contactUs;
