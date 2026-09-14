const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DonorProfile = sequelize.define(
  "DonorProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
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

    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    gender: {
      type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    last_donation_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "donor_profiles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = DonorProfile;