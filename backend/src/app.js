const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const bloodRequestRoutes = require("./routes/bloodRequestRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = new Set([
  // Local development
  "http://localhost:5173",
  "http://127.0.0.1:5173",

  // Vercel production domain
  "https://blood-connect-zeta-opal.vercel.app",

  // Vercel project domain
  "https://blood-connect-git-main-codecrafter1316s-projects.vercel.app",

  // Known Vercel deployment domain
  "https://blood-connect-74ax01px-codecrafter1316s-projects.vercel.app",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // Example: Postman, curl, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow explicitly registered origins
      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments
      if (
        origin.startsWith("https://blood-connect-") &&
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);

      return callback(new Error("Origin is not allowed by CORS"));
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

// ==========================================
// BODY PARSERS
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BloodConnect API is running",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/admin", adminRoutes);

// ==========================================
// API 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  // CORS error
  if (err.message === "Origin is not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy blocked this request",
    });
  }

  // General server error
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ==========================================
// EXPORT APP
// ==========================================

module.exports = app;