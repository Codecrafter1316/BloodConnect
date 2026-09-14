const { Op } = require("sequelize");
const {
  User,
  BloodRequest,
  Connection,
  DonorProfile,
} = require("../models");

const normalizeId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDonors,
      totalRecipients,
      totalAdmins,
      activeUsers,
      inactiveUsers,
      totalBloodRequests,
      openBloodRequests,
      totalConnections,
      pendingConnections,
      acceptedConnections,
    ] = await Promise.all([
      User.count(),
      User.count({ where: { role: "DONOR" } }),
      User.count({ where: { role: "RECIPIENT" } }),
      User.count({ where: { role: "ADMIN" } }),
      User.count({ where: { is_active: true } }),
      User.count({ where: { is_active: false } }),
      BloodRequest.count(),
      BloodRequest.count({ where: { status: "OPEN" } }),
      Connection.count(),
      Connection.count({ where: { status: "PENDING" } }),
      Connection.count({ where: { status: "ACCEPTED" } }),
    ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalDonors,
        totalRecipients,
        totalAdmins,
        activeUsers,
        inactiveUsers,
        totalBloodRequests,
        openBloodRequests,
        totalConnections,
        pendingConnections,
        acceptedConnections,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const { role, is_active } = req.query;

    const where = {};

    if (role) {
      where.role = role;
    }

    if (is_active !== undefined) {
      if (is_active === "true") {
        where.is_active = true;
      } else if (is_active === "false") {
        where.is_active = false;
      }
    }

    const users = await User.findAll({
      where,
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: DonorProfile,
          as: "donorProfile",
          attributes: [
            "id",
            "user_id",
            "blood_group",
            "city",
            "age",
            "gender",
            "is_available",
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get admin users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get users",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = normalizeId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: DonorProfile,
          as: "donorProfile",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user by id error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const id = normalizeId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    let { is_active, status } = req.body;

    if (is_active === undefined && status !== undefined) {
      is_active = status === "ACTIVE" || status === "active" || status === true;
    }

    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_active must be a boolean value",
      });
    }

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.is_active = is_active;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${is_active ? "activated" : "deactivated"} successfully`,
      user,
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};

const getBloodRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    const requests = await BloodRequest.findAll({
      where,
      include: [
        {
          model: User,
          as: "recipient",
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Admin get blood requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get blood requests",
    });
  }
};

const getConnections = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    const connections = await Connection.findAll({
      where,
      include: [
        {
          model: BloodRequest,
          as: "bloodRequest",
        },
        {
          model: User,
          as: "donor",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: User,
          as: "recipient",
          attributes: ["id", "name", "email", "role"],
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
    console.error("Admin get connections error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get connections",
    });
  }
};

module.exports = {
  getDashboard,
  getUsers,
  getUserById,
  updateUserStatus,
  getBloodRequests,
  getConnections,
};
