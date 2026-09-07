
import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
dotenv.config();

let currentKey = null;
let llmInstance = null;

function getLLMInstance() {
  const key =
    process.env.GROQ_API_KEY ||
    process.env.GROQ_KEY ||
    "gsk_dummy_placeholder_for_safe_startup";

  if (!llmInstance || currentKey !== key) {
    currentKey = key;
    llmInstance = new ChatGroq({
      apiKey: key,
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.2,
      maxRetries: 2,
    });
  }
  return llmInstance;
}

if (!process.env.GROQ_API_KEY && !process.env.GROQ_KEY) {
  console.warn(
    "⚠️ GROQ WARNING: No GROQ_API_KEY found in environment variables.\n" +
      "👉 To enable AI features, add GROQ_API_KEY in your environment."
  );
}

const llm = new Proxy(
  {},
  {
    get(_target, prop) {
      const instance = getLLMInstance();
      const val = instance[prop];
      if (typeof val === "function") {
        return function (...args) {
          const key = process.env.GROQ_API_KEY || process.env.GROQ_KEY;
          if (!key || key.startsWith("gsk_dummy_placeholder")) {
            throw new Error(
              "Groq API key not configured. Please set the GROQ_API_KEY environment variable."
            );
          }
          return val.apply(instance, args);
        };
      }
      return val;
    },
  }
);

export default llm;