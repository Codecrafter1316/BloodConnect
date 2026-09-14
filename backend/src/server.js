require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");

require("./models");

const PORT = 5000;
const HOST = "0.0.0.0";

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();

    console.log("MySQL database connected successfully");

    // Synchronize Sequelize models with MySQL
    await sequelize.sync();

    try {
      await sequelize.query(
        "ALTER TABLE blood_requests ADD COLUMN required_date DATE NULL"
      );
    } catch (error) {
      if (error.original?.code !== "ER_DUP_FIELDNAME") {
        throw error;
      }
    }

    console.log("Database tables synchronized successfully");

    // Start Express server
    app.listen(PORT, HOST, () => {
      console.log(`Server running on ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();