const express = require("express");

const {
  createDonorProfile,
  getMyDonorProfile,
  updateDonorProfile,
  updateAvailability,
  searchDonors,
} = require("../controllers/donorController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// All donor routes require authentication
router.use(protect);

router.post("/profile", authorizeRoles("DONOR"), createDonorProfile);
router.get("/profile", authorizeRoles("DONOR"), getMyDonorProfile);
router.put("/profile", authorizeRoles("DONOR"), updateDonorProfile);
router.patch("/availability", authorizeRoles("DONOR"), updateAvailability);
router.get("/search", authorizeRoles("RECIPIENT"), searchDonors);

module.exports = router;