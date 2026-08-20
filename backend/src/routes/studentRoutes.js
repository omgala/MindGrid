const express = require("express");

const pool = require("../config/database");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


router.get(
    "/profile",
    authenticateToken,
    authorizeRoles("STUDENT"),

    async (req, res) => {

        try {

            const result = await pool.query(
                `
                SELECT
                    sp.anonymous_id,
                    sp.department,
                    sp.year_of_study
                FROM student_profiles sp
                WHERE sp.user_id = $1
                `,
                [req.user.userId]
            );


            if (result.rows.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Student profile not found"
                });

            }


            res.json({
                success: true,
                profile: result.rows[0]
            });


        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: "Failed to retrieve profile"
            });

        }

    }
);


module.exports = router;