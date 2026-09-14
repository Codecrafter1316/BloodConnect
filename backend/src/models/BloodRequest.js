const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BloodRequest = sequelize.define(
  "BloodRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    recipient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    blood_group: {
      type: DataTypes.ENUM(
        "O-",
        "O+",
        "A-",
        "A+",
        "B-",
        "B+",
        "AB-",
        "AB+"
      ),
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    hospital_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    units_required: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },

    urgency: {
      type: DataTypes.ENUM("NORMAL", "URGENT", "CRITICAL"),
      allowNull: false,
      defaultValue: "NORMAL",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    required_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "OPEN",
        "PARTIALLY_FULFILLED",
        "FULFILLED",
        "CANCELLED"
      ),
      allowNull: false,
      defaultValue: "OPEN",
    },
  },
  {
    tableName: "blood_requests",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = BloodRequest;