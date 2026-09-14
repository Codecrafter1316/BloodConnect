const express = require("express");

const {
  getDashboard,
  getUsers,
  getUserById,
  updateUserStatus,
  getBloodRequests,
  getConnections,
} = require("../controllers/adminController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("ADMIN"));

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/status", updateUserStatus);
router.get("/blood-requests", getBloodRequests);
router.get("/connections", getConnections);

module.exports = router;
