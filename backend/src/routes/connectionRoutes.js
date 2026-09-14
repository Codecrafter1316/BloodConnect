const express = require("express");

const router = express.Router();

const {
  sendConnectionRequest,
  getMySentConnections,
  getMyReceivedConnections,
  updateConnectionStatus,
} = require("../controllers/connectionController");

const { protect } = require("../middleware/authMiddleware");

// ==========================================
// SEND CONNECTION
// ==========================================

router.post(
  "/",
  protect,
  sendConnectionRequest
);

// ==========================================
// SENT CONNECTIONS
// ==========================================

router.get(
  "/sent",
  protect,
  getMySentConnections
);

// ==========================================
// RECEIVED CONNECTIONS
// ==========================================

router.get(
  "/received",
  protect,
  getMyReceivedConnections
);

// ==========================================
// UPDATE CONNECTION STATUS
// ==========================================

router.patch(
  "/:id/status",
  protect,
  updateConnectionStatus
);

module.exports = router;