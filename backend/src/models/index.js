const User = require("./User");
const DonorProfile = require("./DonorProfile");
const BloodRequest = require("./BloodRequest");
const Connection = require("./Connection");

// ==========================================
// USER ↔ DONOR PROFILE
// ==========================================

User.hasOne(DonorProfile, {
  foreignKey: "user_id",
  as: "donorProfile",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

DonorProfile.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// ==========================================
// USER ↔ BLOOD REQUEST
// ==========================================

User.hasMany(BloodRequest, {
  foreignKey: "recipient_id",
  as: "bloodRequests",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

BloodRequest.belongsTo(User, {
  foreignKey: "recipient_id",
  as: "recipient",
});

// ==========================================
// BLOOD REQUEST ↔ CONNECTION
// ==========================================

BloodRequest.hasMany(Connection, {
  foreignKey: "blood_request_id",
  as: "connections",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Connection.belongsTo(BloodRequest, {
  foreignKey: "blood_request_id",
  as: "bloodRequest",
});

// ==========================================
// USER ↔ DONOR CONNECTIONS
// ==========================================

// Connection.donor_id → User.id

User.hasMany(Connection, {
  foreignKey: "donor_id",
  as: "donorConnections",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Connection.belongsTo(User, {
  foreignKey: "donor_id",
  as: "donor",
});

// ==========================================
// USER ↔ RECIPIENT CONNECTIONS
// ==========================================

// Connection.recipient_id → User.id

User.hasMany(Connection, {
  foreignKey: "recipient_id",
  as: "recipientConnections",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Connection.belongsTo(User, {
  foreignKey: "recipient_id",
  as: "recipient",
});

// ==========================================
// EXPORT MODELS
// ==========================================

module.exports = {
  User,
  DonorProfile,
  BloodRequest,
  Connection,
};