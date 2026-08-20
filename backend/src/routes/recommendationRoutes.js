const express = require("express");

const router = express.Router();

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

const {
    getRecommendations
} = require("../controllers/recommendationController");


router.get(
    "/",
    authenticateToken,
    authorizeRoles("STUDENT"),
    getRecommendations
);


module.exports = router;