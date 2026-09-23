// import "server-only"

const required = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_KEY",
  "SUPABASE_JWT_SECRET",
];

// const missing = required.filter((key) => !process.env[key]);
// if (missing.length > 0) {
//   throw new Error(
//     `Missing required environment variables: ${missing.join(", ")}\n` +
//       "Add these to .env.local (see .env.example)."
//   );
// }

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  isDev: (process.env.NODE_ENV || "development") === "development",
  isProd: process.env.NODE_ENV === "production",

  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    jwtSecret: process.env.SUPABASE_JWT_SECRET,
  },

  cors: {
    origins: (process.env.CORS_ORIGINS || "http://localhost:3000")
      .split(",")
      .map((o) => o.trim()),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    authMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX || "20", 10),
  },
};

export default env;
