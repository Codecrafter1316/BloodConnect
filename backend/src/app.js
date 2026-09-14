const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const bloodRequestRoutes = require("./routes/bloodRequestRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ==========================================
// Middleware
// ==========================================

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Health Check
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BloodConnect API is running",
  });
});

// ==========================================
// API Routes
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;