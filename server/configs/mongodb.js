import mongoose from "mongoose";

// Connect to the MongoDB database
const connectDB = async () => {

  try {
    mongoose.connection.on("connected", () => console.log("Database Connected"));
    await mongoose.connect(`${process.env.MONGODB_URL}/lms`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}


export default connectDB;