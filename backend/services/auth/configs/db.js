import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // fallback
}

export const connectDb = async () => {
  if (!process.env.MONGODB_URL) {
    console.error(
      "⚠️ MONGODB WARNING: MONGODB_URL is not defined in environment variables.\n" +
        "👉 Please set MONGODB_URL in your environment."
    );
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("🟢 DB Connected successfully to database:", mongoose.connection.name);
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
  }
};