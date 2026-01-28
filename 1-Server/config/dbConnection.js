import mongoose from "mongoose";

// mongoose.set('strict', false);

const connectionToDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("DB connected");
}
export default connectionToDB;