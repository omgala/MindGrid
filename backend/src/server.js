require("dotenv").config();

const app = require("./app");
const pool = require("./config/database");
const chatRoutes = require("./routes/chatRoutes");

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await pool.query("SELECT NOW()");

        console.log("PostgreSQL connected successfully");

        app.listen(PORT, () => {
            console.log(`MindGrid backend running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to connect to PostgreSQL:");
        console.error(error.message);

        process.exit(1);
    }
}

startServer();