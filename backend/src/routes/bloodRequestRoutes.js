const express = require("express");

const {
  createBloodRequest,
  getOpenBloodRequests,
  getMyBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  cancelBloodRequest,
} = require("../controllers/bloodRequestController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/open", getOpenBloodRequests);
router.get("/available", getOpenBloodRequests);
router.get("/my", getMyBloodRequests);
router.post("/", authorizeRoles("RECIPIENT"), createBloodRequest);
router.get("/", getMyBloodRequests);
router.get("/:id", getBloodRequestById);
router.put("/:id", authorizeRoles("RECIPIENT"), updateBloodRequest);
router.patch("/:id/cancel", authorizeRoles("RECIPIENT"), cancelBloodRequest);
router.patch("/:id/close", authorizeRoles("RECIPIENT"), cancelBloodRequest);

module.exports = router;