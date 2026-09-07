import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy(times) {
    if (times > 5) {
      return null;
    }
    return Math.min(times * 100, 2000);
  },
  lazyConnect: true,
});

redis.on("connect", () => {
  console.log("🟢 Redis connected successfully");
});

redis.on("error", (err) => {
  console.warn("⚠️ Redis warning (cache offline/reconnecting):", err.message);
});

redis.connect().catch((err) => {
  console.warn("⚠️ Redis initial connect failed (continuing without Redis cache):", err.message);
});

export default redis;