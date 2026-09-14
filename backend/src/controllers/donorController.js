const { DonorProfile, User } = require("../models");

// ==========================================
// CREATE DONOR PROFILE
// ==========================================

const createDonorProfile = async (req, res) => {
  try {
    const {
      blood_group,
      age,
      gender,
      city,
      address,
      is_available,
      last_donation_date,
    } = req.body;

    if (!blood_group || !age || !gender || !city) {
      return res.status(400).json({
        success: false,
        message: "Blood group, age, gender and city are required",
      });
    }

    const existingProfile = await DonorProfile.findOne({
      where: { user_id: req.user.id },
    });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Donor profile already exists",
      });
    }

    const donorProfile = await DonorProfile.create({
      user_id: req.user.id,
      blood_group,
      age,
      gender,
      city,
      address: address || null,
      is_available:
        is_available !== undefined ? is_available : true,
      last_donation_date: last_donation_date || null,
    });

    return res.status(201).json({
      success: true,
      message: "Donor profile created successfully",
      donorProfile,
    });
  } catch (error) {
    console.error("Create donor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create donor profile",
    });
  }
};

// ==========================================
// GET MY DONOR PROFILE
// ==========================================

const getMyDonorProfile = async (req, res) => {
  try {
    const donorProfile = await DonorProfile.findOne({
      where: { user_id: req.user.id },
    });

    if (!donorProfile) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      donorProfile,
    });
  } catch (error) {
    console.error("Get donor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get donor profile",
    });
  }
};

// ==========================================
// UPDATE MY DONOR PROFILE
// ==========================================

const updateDonorProfile = async (req, res) => {
  try {
    const donorProfile = await DonorProfile.findOne({
      where: { user_id: req.user.id },
    });

    if (!donorProfile) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found",
      });
    }

    const allowedFields = [
      "blood_group",
      "age",
      "gender",
      "city",
      "address",
      "is_available",
      "last_donation_date",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        donorProfile[field] = req.body[field];
      }
    });

    await donorProfile.save();

    return res.status(200).json({
      success: true,
      message: "Donor profile updated successfully",
      donorProfile,
    });
  } catch (error) {
    console.error("Update donor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update donor profile",
    });
  }
};

// ==========================================
// TOGGLE AVAILABILITY
// ==========================================

const updateAvailability = async (req, res) => {
  try {
    const { is_available } = req.body;

    if (typeof is_available !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_available must be true or false",
      });
    }

    const donorProfile = await DonorProfile.findOne({
      where: { user_id: req.user.id },
    });

    if (!donorProfile) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found",
      });
    }

    donorProfile.is_available = is_available;

    await donorProfile.save();

    return res.status(200).json({
      success: true,
      message: `Donor availability ${
        is_available ? "enabled" : "disabled"
      }`,
      is_available: donorProfile.is_available,
    });
  } catch (error) {
    console.error("Availability update error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update availability",
    });
  }
};

// ==========================================
// SEARCH DONORS
// ==========================================

const searchDonors = async (req, res) => {
  try {
    const { blood_group, city } = req.query;

    const where = {
      is_available: true,
    };

    if (blood_group) {
      where.blood_group = blood_group;
    }

    if (city) {
      where.city = city;
    }

    const donors = await DonorProfile.findAll({
      where,
      attributes: {
        exclude: ["created_at", "updated_at"],
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone", "role"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count: donors.length,
      donors,
    });
  } catch (error) {
    console.error("Search donors error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search donors",
    });
  }
};

module.exports = {
  createDonorProfile,
  getMyDonorProfile,
  updateDonorProfile,
  updateAvailability,
  searchDonors,
};