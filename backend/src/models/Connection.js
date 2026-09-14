const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Connection = sequelize.define(
  "Connection",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    blood_request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    recipient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    donor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "CANCELLED",
        "COMPLETED"
      ),
      allowNull: false,
      defaultValue: "PENDING",
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "connections",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    indexes: [
      {
        unique: true,
        fields: ["blood_request_id", "donor_id"],
      },
    ],
  }
);

module.exports = Connection;