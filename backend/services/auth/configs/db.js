import mongoose from "mongoose";

export const connectDb = async () => {
  if (!process.env.MONGODB_URL) {
    console.error(
      "⚠️ MONGODB WARNING: MONGODB_URL is not defined in environment variables.\n" +
        "👉 Please set MONGODB_URL in your environment."
    );
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("🟢 DB Connected successfully");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
  }
};