import express from "express"
import dotenv from "dotenv"
dotenv.config()
import proxy from "express-http-proxy"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { getCurrentUser } from "./controllers/user.controller.js"
import { isAuth } from "./middleware/isAuth.js"
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js"
const app = express()
const configuredOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : [];

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://career-forge-ai-eight.vercel.app",
];

const allAllowedOrigins = [...new Set([...defaultAllowedOrigins, ...configuredOrigins])];

app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allAllowedOrigins.includes(origin) || allAllowedOrigins.includes("*")) {
        return callback(null, true);
      }
      if (
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true
}))

app.use(morgan("dev"))
app.use(cookieParser())

const PORT = process.env.PORT || 6000

app.get("/" , (req,res)=>{
    res.send("Hello from Gateway")
})


app.use("/api/auth" , proxy(process.env.AUTH_SERVICE_URL))
app.use("/api/resume" ,isAuth, proxyWithHeaders(process.env.RESUME_SERVICE_URL))
app.use("/api/interview",isAuth ,proxyWithHeaders(process.env.INTERVIEW_SERVICE_URL))
app.use("/api/roadmap",isAuth ,proxyWithHeaders(process.env.ROADMAP_SERVICE_URL))
app.use("/api/billing",isAuth ,proxyWithHeaders(process.env.BILLING_SERVICE_URL))
app.get("/api/me",isAuth,getCurrentUser)





app.listen(PORT , ()=>{
    console.log(`Gateway Started on ${PORT}`)
})