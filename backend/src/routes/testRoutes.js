const express = require("express");
const pool = require("../config/database");

const router = express.Router();

router.get("/database", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT current_database() AS database,
                   current_user AS user
        `);

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

module.exports = router;