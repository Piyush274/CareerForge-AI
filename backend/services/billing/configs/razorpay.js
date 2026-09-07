import dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    "⚠️ RAZORPAY WARNING: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing.\n" +
      "👉 Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Environment Variables if using payment features."
  );
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

export default razorpay;