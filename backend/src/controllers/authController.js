const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// ==========================================
// Generate JWT
// ==========================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// ==========================================
// REGISTER
// ==========================================

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const publicRole = role || "RECIPIENT";

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (!["DONOR", "RECIPIENT"].includes(publicRole)) {
      return res.status(400).json({
        success: false,
        message: "Public registration is only available for donor or recipient accounts",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
      role: publicRole,
    });

    // Generate token
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during registration",
    });
  }
};

// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.is_active === false) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact support.",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

// ==========================================
// GET CURRENT USER
// ==========================================

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
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

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (name !== undefined && (!String(name).trim() || String(name).length > 100)) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 1 and 100 characters",
      });
    }

    if (phone !== undefined && phone !== null && String(phone).length > 20) {
      return res.status(400).json({
        success: false,
        message: "Phone must be 20 characters or fewer",
      });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name !== undefined) user.name = String(name).trim();
    if (phone !== undefined) user.phone = phone || null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
};