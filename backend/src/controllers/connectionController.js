const { Op } = require("sequelize");
const {
  Connection,
  BloodRequest,
  DonorProfile,
  User,
} = require("../models");

// ==========================================
// SEND CONNECTION REQUEST
// ==========================================

const sendConnectionRequest = async (req, res) => {
  try {
    const { blood_request_id, donor_id, message } = req.body;

    // ------------------------------------------
    // Validate input
    // ------------------------------------------

    if (!blood_request_id || !donor_id) {
      return res.status(400).json({
        success: false,
        message: "blood_request_id and donor_id are required",
      });
    }

    // ------------------------------------------
    // Check blood request
    // ------------------------------------------

    const bloodRequest = await BloodRequest.findOne({
      where: {
        id: blood_request_id,
        recipient_id: req.user.id,
      },
    });

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    // ------------------------------------------
    // Check request status
    // ------------------------------------------

    if (bloodRequest.status !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: "This blood request is no longer open",
      });
    }

    // ------------------------------------------
    // Check donor USER
    // donor_id refers to User.id
    // ------------------------------------------

    const donor = await User.findOne({
      where: {
        id: donor_id,
        role: "DONOR",
      },
    });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    // ------------------------------------------
    // Check donor profile
    // ------------------------------------------

    const donorProfile = await DonorProfile.findOne({
      where: {
        user_id: donor.id,
      },
    });

    if (!donorProfile) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found",
      });
    }

    // ------------------------------------------
    // Check donor availability
    // ------------------------------------------

    if (!donorProfile.is_available) {
      return res.status(400).json({
        success: false,
        message: "Donor is currently unavailable",
      });
    }

    // ------------------------------------------
    // Prevent self connection
    // ------------------------------------------

    if (donor.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot connect with yourself",
      });
    }

    // ------------------------------------------
    // Check existing connection
    // ------------------------------------------

    const existingConnection = await Connection.findOne({
      where: {
        blood_request_id,
        donor_id: donor.id,
      },
    });

    if (existingConnection) {
      return res.status(409).json({
        success: false,
        message: "Connection request already exists",
        connection: existingConnection,
      });
    }

    // ------------------------------------------
    // Create connection
    // ------------------------------------------

    const connection = await Connection.create({
      blood_request_id,
      recipient_id: req.user.id,
      donor_id: donor.id,
      status: "PENDING",
      message: message || null,
    });

    // ------------------------------------------
    // Return created connection with donor info
    // ------------------------------------------

    const createdConnection = await Connection.findByPk(
      connection.id,
      {
        include: [
          {
            model: BloodRequest,
            as: "bloodRequest",
          },
          {
            model: User,
            as: "donor",
            attributes: ["id", "name", "email", "phone", "role"],
            include: [
              {
                model: DonorProfile,
                as: "donorProfile",
              },
            ],
          },
        ],
      }
    );

    return res.status(201).json({
      success: true,
      message: "Connection request sent successfully",
      connection: createdConnection,
    });
  } catch (error) {
    console.error("Send connection error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send connection request",
      error: error.message,
    });
  }
};

// ==========================================
// GET MY SENT CONNECTIONS
// ==========================================

const getMySentConnections = async (req, res) => {
  try {
    const connections = await Connection.findAll({
      where: {
        recipient_id: req.user.id,
      },

      include: [
        // ------------------------------------------
        // Blood Request
        // ------------------------------------------

        {
          model: BloodRequest,
          as: "bloodRequest",
          attributes: [
            "id",
            "recipient_id",
            "blood_group",
            "city",
            "hospital_name",
            "units_required",
            "urgency",
            "description",
            "required_date",
            "status",
            "created_at",
            "updated_at",
          ],
        },

        // ------------------------------------------
        // Donor User
        // ------------------------------------------

        {
          model: User,
          as: "donor",
          attributes: [
            "id",
            "name",
            "email",
            "phone",
            "role",
          ],

          include: [
            {
              model: DonorProfile,
              as: "donorProfile",
              attributes: [
                "id",
                "user_id",
                "blood_group",
                "age",
                "gender",
                "city",
                "address",
                "is_available",
                "last_donation_date",
              ],
            },
          ],
        },
      ],

      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: connections.length,
      connections,
    });
  } catch (error) {
    console.error("Get sent connections error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get sent connections",
      error: error.message,
    });
  }
};

// ==========================================
// GET MY RECEIVED CONNECTIONS
// ==========================================

const getMyReceivedConnections = async (req, res) => {
  try {
    // ------------------------------------------
    // Find connections where current user
    // is the donor
    // ------------------------------------------

    const connections = await Connection.findAll({
      where: {
        donor_id: req.user.id,
      },

      include: [
        // ------------------------------------------
        // Blood Request
        // ------------------------------------------

        {
          model: BloodRequest,
          as: "bloodRequest",
          attributes: [
            "id",
            "recipient_id",
            "blood_group",
            "city",
            "hospital_name",
            "units_required",
            "urgency",
            "description",
            "status",
            "created_at",
            "updated_at",
          ],
        },

        // ------------------------------------------
        // Recipient User
        // ------------------------------------------

        {
          model: User,
          as: "recipient",
          attributes: [
            "id",
            "name",
            "email",
            "phone",
            "role",
          ],
        },
      ],

      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: connections.length,
      connections,
    });
  } catch (error) {
    console.error("Get received connections error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get received connections",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE CONNECTION STATUS
// ==========================================

const updateConnectionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "ACCEPTED",
      "REJECTED",
      "CANCELLED",
      "COMPLETED",
    ];

    // ------------------------------------------
    // Validate status
    // ------------------------------------------

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Use ACCEPTED, REJECTED, CANCELLED or COMPLETED",
      });
    }

    // ------------------------------------------
    // Find connection
    // ------------------------------------------

    const connection = await Connection.findByPk(
      req.params.id
    );

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection not found",
      });
    }

    // ------------------------------------------
    // Check recipient
    // ------------------------------------------

    const isRecipient =
      connection.recipient_id === req.user.id;

    // ------------------------------------------
    // Check donor
    // donor_id directly references User.id
    // ------------------------------------------

    const isDonor =
      connection.donor_id === req.user.id;

    // ------------------------------------------
    // Authorization
    // ------------------------------------------

    if (!isRecipient && !isDonor) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this connection",
      });
    }

    // ------------------------------------------
    // Donor controls ACCEPTED / REJECTED
    // ------------------------------------------

    if (
      (status === "ACCEPTED" ||
        status === "REJECTED") &&
      !isDonor
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only the donor can accept or reject a connection",
      });
    }

    // ------------------------------------------
    // Recipient controls CANCELLED
    // ------------------------------------------

    if (status === "CANCELLED" && !isRecipient) {
      return res.status(403).json({
        success: false,
        message:
          "Only the recipient can cancel a connection",
      });
    }

    // ------------------------------------------
    // Update status
    // ------------------------------------------

    connection.status = status;

    await connection.save();

    // ------------------------------------------
    // Return updated connection
    // ------------------------------------------

    const updatedConnection =
      await Connection.findByPk(connection.id, {
        include: [
          {
            model: BloodRequest,
            as: "bloodRequest",
          },
          {
            model: User,
            as: "donor",
            attributes: [
              "id",
              "name",
              "email",
              "phone",
              "role",
            ],
          },
          {
            model: User,
            as: "recipient",
            attributes: [
              "id",
              "name",
              "email",
              "phone",
              "role",
            ],
          },
        ],
      });

    return res.status(200).json({
      success: true,
      message: `Connection ${status.toLowerCase()} successfully`,
      connection: updatedConnection,
    });
  } catch (error) {
    console.error(
      "Update connection status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update connection status",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  sendConnectionRequest,
  getMySentConnections,
  getMyReceivedConnections,
  updateConnectionStatus,
};