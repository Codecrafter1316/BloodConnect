const { BloodRequest } = require("../models");

// ==========================================
// GET OPEN BLOOD REQUESTS
// ==========================================

const getOpenBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.findAll({
      where: {
        status: "OPEN",
      },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get open blood requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get open blood requests",
    });
  }
};

// ==========================================
// CREATE BLOOD REQUEST
// ==========================================

const createBloodRequest = async (req, res) => {
  try {
    const {
      blood_group,
      city,
      hospital_name,
      units_required,
      urgency,
      description,
      required_date,
    } = req.body;

    if (
      !blood_group ||
      !city ||
      !hospital_name
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Blood group, city and hospital name are required",
      });
    }

    const bloodRequest = await BloodRequest.create({
      recipient_id: req.user.id,
      blood_group,
      city,
      hospital_name,
      units_required: units_required || 1,
      urgency: urgency || "NORMAL",
      description: description || null,
      required_date: required_date || null,
      status: "OPEN",
    });

    return res.status(201).json({
      success: true,
      message: "Blood request created successfully",
      bloodRequest,
    });
  } catch (error) {
    console.error("Create blood request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create blood request",
    });
  }
};

// ==========================================
// GET MY BLOOD REQUESTS
// ==========================================

const getMyBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.findAll({
      where: {
        recipient_id: req.user.id,
      },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get blood requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get blood requests",
    });
  }
};

// ==========================================
// GET SINGLE BLOOD REQUEST
// ==========================================

const getBloodRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    const isOwner = request.recipient_id === req.user.id;
    const isOpenRequest = request.status === "OPEN";

    if (!isOwner && !(req.user.role === "DONOR" && isOpenRequest)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this blood request",
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("Get blood request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get blood request",
    });
  }
};

// ==========================================
// UPDATE BLOOD REQUEST
// ==========================================

const updateBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findOne({
      where: {
        id: req.params.id,
        recipient_id: req.user.id,
      },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    const allowedFields = [
      "blood_group",
      "city",
      "hospital_name",
      "units_required",
      "urgency",
      "description",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        request[field] = req.body[field];
      }
    });

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Blood request updated successfully",
      request,
    });
  } catch (error) {
    console.error("Update blood request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update blood request",
    });
  }
};

// ==========================================
// CANCEL BLOOD REQUEST
// ==========================================

const cancelBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findOne({
      where: {
        id: req.params.id,
        recipient_id: req.user.id,
      },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    request.status = "CANCELLED";

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Blood request cancelled successfully",
      request,
    });
  } catch (error) {
    console.error("Cancel blood request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel blood request",
    });
  }
};

module.exports = {
  createBloodRequest,
  getOpenBloodRequests,
  getMyBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  cancelBloodRequest,
};